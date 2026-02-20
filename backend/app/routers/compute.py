"""Compute endpoint: API-05 — run readiness inference engine."""

import time
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_instructor
from app.database import get_db
from app.models.models import (
    ClassAggregate,
    Cluster,
    ClusterAssignment,
    ConceptGraph,
    Exam,
    Parameter,
    Question,
    QuestionConceptMap,
    ReadinessResult,
    Score,
    StudentToken,
)
from app.schemas.schemas import ComputeRequest, ComputeResponse
from app.services.cluster_service import run_clustering
from app.services.compute_service import run_readiness_pipeline
from app.services.report_service import generate_student_token

router = APIRouter(prefix="/api/v1/exams", tags=["Compute"])


@router.post("/{exam_id}/compute", response_model=ComputeResponse)
async def compute_readiness(
    exam_id: UUID,
    body: ComputeRequest = ComputeRequest(),
    db: AsyncSession = Depends(get_db),
    _user: str = Depends(get_current_instructor),
):
    """Run the full readiness computation pipeline.

    1. Loads scores, mapping, graph from DB
    2. Runs 4-stage readiness inference
    3. Runs k-means clustering
    4. Generates student tokens
    5. Persists all results
    """
    start = time.time()

    # --- Verify exam exists ---
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Exam not found")

    # --- Load parameters ---
    p_result = await db.execute(
        select(Parameter).where(Parameter.exam_id == exam_id)
    )
    params = p_result.scalar_one_or_none()
    alpha = body.alpha if body.alpha != 1.0 else (params.alpha if params else 1.0)
    beta = body.beta if body.beta != 0.3 else (params.beta if params else 0.3)
    gamma = body.gamma if body.gamma != 0.2 else (params.gamma if params else 0.2)
    threshold = body.threshold if body.threshold != 0.6 else (params.threshold if params else 0.6)

    # --- Load scores ---
    score_result = await db.execute(
        select(Score, Question)
        .join(Question, Score.question_id == Question.id)
        .where(Score.exam_id == exam_id)
    )
    score_rows = score_result.all()

    if not score_rows:
        raise HTTPException(
            status_code=400,
            detail="No scores found. Upload scores first (POST /scores).",
        )

    # Build scores dict: {student_id: {question_external_id: score}}
    scores_dict: dict[str, dict[str, float]] = {}
    max_scores_dict: dict[str, float] = {}
    for score_obj, question_obj in score_rows:
        sid = score_obj.student_id_external
        qid = question_obj.question_id_external
        if sid not in scores_dict:
            scores_dict[sid] = {}
        scores_dict[sid][qid] = score_obj.score
        max_scores_dict[qid] = question_obj.max_score

    # --- Load question-concept mapping ---
    qcm_result = await db.execute(
        select(QuestionConceptMap, Question)
        .join(Question, QuestionConceptMap.question_id == Question.id)
        .where(Question.exam_id == exam_id)
    )
    qcm_rows = qcm_result.all()

    if not qcm_rows:
        raise HTTPException(
            status_code=400,
            detail="No question-concept mapping found. Upload mapping first (POST /mapping).",
        )

    # Build concept map: {concept_id: [(question_external_id, weight), ...]}
    question_concept_map: dict[str, list[tuple[str, float]]] = {}
    for qcm_obj, question_obj in qcm_rows:
        cid = qcm_obj.concept_id
        qid = question_obj.question_id_external
        if cid not in question_concept_map:
            question_concept_map[cid] = []
        question_concept_map[cid].append((qid, qcm_obj.weight))

    # --- Load graph ---
    g_result = await db.execute(
        select(ConceptGraph)
        .where(ConceptGraph.exam_id == exam_id)
        .order_by(ConceptGraph.version.desc())
        .limit(1)
    )
    graph_row = g_result.scalar_one_or_none()

    if not graph_row:
        # Auto-create graph with isolated nodes (one per concept)
        all_concepts = set(question_concept_map.keys())
        graph_json = {
            "nodes": [{"id": c, "label": c} for c in all_concepts],
            "edges": [],
        }
    else:
        graph_json = graph_row.graph_json

    # --- Run readiness pipeline ---
    pipeline_result = run_readiness_pipeline(
        scores=scores_dict,
        max_scores=max_scores_dict,
        question_concept_map=question_concept_map,
        graph_json=graph_json,
        alpha=alpha,
        beta=beta,
        gamma=gamma,
        threshold=threshold,
    )

    # --- Clear old results ---
    await db.execute(delete(ReadinessResult).where(ReadinessResult.exam_id == exam_id))
    await db.execute(delete(ClassAggregate).where(ClassAggregate.exam_id == exam_id))
    await db.execute(delete(ClusterAssignment).where(ClusterAssignment.exam_id == exam_id))
    await db.execute(delete(Cluster).where(Cluster.exam_id == exam_id))
    await db.flush()

    # --- Persist readiness results ---
    for r in pipeline_result["readiness_results"]:
        rr = ReadinessResult(
            exam_id=exam_id,
            student_id_external=r["student_id"],
            concept_id=r["concept_id"],
            direct_readiness=r["direct_readiness"],
            prerequisite_penalty=r["prerequisite_penalty"],
            downstream_boost=r["downstream_boost"],
            final_readiness=r["final_readiness"],
            confidence=r["confidence"],
            explanation_trace_json=r["explanation_trace"],
        )
        db.add(rr)

    # --- Persist class aggregates ---
    for agg in pipeline_result["class_aggregates"]:
        ca = ClassAggregate(
            exam_id=exam_id,
            concept_id=agg["concept_id"],
            mean_readiness=agg["mean_readiness"],
            median_readiness=agg["median_readiness"],
            std_readiness=agg["std_readiness"],
            below_threshold_count=agg["below_threshold_count"],
        )
        db.add(ca)

    # --- Run clustering ---
    clustering_result = run_clustering(
        final_readiness_matrix=pipeline_result["final_readiness_matrix"],
        concepts=pipeline_result["concepts"],
        students=pipeline_result["students"],
    )

    for cl in clustering_result["clusters"]:
        cluster = Cluster(
            exam_id=exam_id,
            cluster_label=cl["cluster_label"],
            centroid_json=cl["centroid"],
            student_count=cl["student_count"],
        )
        db.add(cluster)
        await db.flush()

        # Assign students to clusters
        for student_id, label in clustering_result["assignments"].items():
            if label == cl["cluster_label"]:
                ca = ClusterAssignment(
                    exam_id=exam_id,
                    student_id_external=student_id,
                    cluster_id=cluster.id,
                )
                db.add(ca)

    # --- Generate student tokens (if not already existing) ---
    for student_id in pipeline_result["students"]:
        existing = await db.execute(
            select(StudentToken).where(
                StudentToken.exam_id == exam_id,
                StudentToken.student_id_external == student_id,
            )
        )
        if not existing.scalar_one_or_none():
            token = StudentToken(
                exam_id=exam_id,
                student_id_external=student_id,
                token=generate_student_token(),
            )
            db.add(token)

    await db.flush()

    elapsed = (time.time() - start) * 1000

    return ComputeResponse(
        status="success",
        students_processed=len(pipeline_result["students"]),
        time_ms=round(elapsed, 2),
    )

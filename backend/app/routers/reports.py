"""Student report endpoint: API-09 — token-based access, no auth required."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.models import ConceptGraph, ReadinessResult, StudentToken
from app.schemas.schemas import StudentReportResponse
from app.services.report_service import build_student_report, is_token_expired

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])


@router.get("/{token}", response_model=StudentReportResponse)
async def get_student_report(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a student report using a unique token. No authentication required.

    The report includes:
      - Personal concept graph with readiness coloring
      - Top 5 weakest concepts
      - Study plan (topologically ordered)

    Excludes peer comparisons, rankings, and percentiles.
    """
    # Look up token
    t_result = await db.execute(
        select(StudentToken).where(StudentToken.token == token)
    )
    token_row = t_result.scalar_one_or_none()

    if not token_row:
        raise HTTPException(status_code=404, detail="Invalid or expired report token")

    # Check expiry
    if is_token_expired(token_row.created_at):
        raise HTTPException(status_code=410, detail="Report token has expired")

    exam_id = token_row.exam_id
    student_id = token_row.student_id_external

    # Load graph
    g_result = await db.execute(
        select(ConceptGraph)
        .where(ConceptGraph.exam_id == exam_id)
        .order_by(ConceptGraph.version.desc())
        .limit(1)
    )
    graph_row = g_result.scalar_one_or_none()
    graph_json = graph_row.graph_json if graph_row else {"nodes": [], "edges": []}

    # Load all readiness results for this exam
    rr_result = await db.execute(
        select(ReadinessResult).where(ReadinessResult.exam_id == exam_id)
    )
    all_results = rr_result.scalars().all()

    # Convert to dicts for the service
    results_dicts = [
        {
            "student_id": r.student_id_external,
            "concept_id": r.concept_id,
            "direct_readiness": r.direct_readiness,
            "prerequisite_penalty": r.prerequisite_penalty,
            "downstream_boost": r.downstream_boost,
            "final_readiness": r.final_readiness,
            "confidence": r.confidence,
        }
        for r in all_results
        if r.student_id_external == student_id
    ]

    concepts = list({r["concept_id"] for r in results_dicts})

    report = build_student_report(
        student_id=student_id,
        exam_id=str(exam_id),
        graph_json=graph_json,
        readiness_results=results_dicts,
        concepts=concepts,
    )

    return StudentReportResponse(**report)

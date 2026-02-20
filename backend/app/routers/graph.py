"""Graph PATCH endpoint: API-04."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_instructor
from app.database import get_db
from app.models.models import ConceptGraph, Exam
from app.schemas.schemas import GraphPatchRequest, GraphPatchResponse
from app.services.graph_service import apply_patch

router = APIRouter(prefix="/api/v1/exams", tags=["Graph"])


@router.patch("/{exam_id}/graph", response_model=GraphPatchResponse)
async def patch_graph(
    exam_id: UUID,
    body: GraphPatchRequest,
    db: AsyncSession = Depends(get_db),
    _user: str = Depends(get_current_instructor),
):
    """Edit the concept dependency graph: add/remove nodes and edges.

    Re-validates DAG after every edit. Invalid changes are rejected
    with cycle path information.
    """
    # Verify exam exists
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Exam not found")

    # Get latest graph
    g_result = await db.execute(
        select(ConceptGraph)
        .where(ConceptGraph.exam_id == exam_id)
        .order_by(ConceptGraph.version.desc())
        .limit(1)
    )
    graph_row = g_result.scalar_one_or_none()

    if not graph_row:
        raise HTTPException(
            status_code=404,
            detail="No graph found. Upload a graph first (POST /graph).",
        )

    # Apply patch
    updated_json, is_dag, cycle_path, errors = apply_patch(
        graph_row.graph_json, body
    )

    if errors:
        return GraphPatchResponse(
            status="error",
            is_dag=is_dag,
            cycle_path=cycle_path,
        )

    # Save as new version
    new_graph = ConceptGraph(
        exam_id=exam_id,
        version=graph_row.version + 1,
        graph_json=updated_json,
    )
    db.add(new_graph)
    await db.flush()

    return GraphPatchResponse(status="success", is_dag=True)

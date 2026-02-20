"""Pydantic request/response schemas for all API endpoints."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Course
# ---------------------------------------------------------------------------

class CourseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)


class CourseResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Exam
# ---------------------------------------------------------------------------

class ExamCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)


class ExamResponse(BaseModel):
    id: UUID
    course_id: UUID
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Upload Responses
# ---------------------------------------------------------------------------

class ValidationError(BaseModel):
    """A single validation error with location detail."""
    row: Optional[int] = None
    field: Optional[str] = None
    message: str


class ScoresUploadResponse(BaseModel):
    status: str
    row_count: int = 0
    errors: list[ValidationError] = []


class MappingUploadResponse(BaseModel):
    status: str
    concept_count: int = 0
    errors: list[ValidationError] = []


# ---------------------------------------------------------------------------
# Graph
# ---------------------------------------------------------------------------

class GraphNode(BaseModel):
    id: str
    label: str


class GraphEdge(BaseModel):
    source: str
    target: str
    weight: float = 0.5


class GraphUploadRequest(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class GraphUploadResponse(BaseModel):
    status: str
    node_count: int = 0
    edge_count: int = 0
    is_dag: bool = True
    errors: list[ValidationError] = []


class GraphPatchRequest(BaseModel):
    add_nodes: list[GraphNode] = []
    remove_nodes: list[str] = []
    add_edges: list[GraphEdge] = []
    remove_edges: list[GraphEdge] = []


class GraphPatchResponse(BaseModel):
    status: str
    is_dag: bool = True
    cycle_path: Optional[list[str]] = None


# ---------------------------------------------------------------------------
# Compute
# ---------------------------------------------------------------------------

class ComputeRequest(BaseModel):
    alpha: float = 1.0
    beta: float = 0.3
    gamma: float = 0.2
    threshold: float = 0.6


class ComputeResponse(BaseModel):
    status: str
    students_processed: int = 0
    time_ms: float = 0.0


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

class HeatmapCell(BaseModel):
    concept_id: str
    concept_label: str
    bucket: str  # e.g. "0-20", "20-40", ...
    count: int
    percentage: float


class AlertItem(BaseModel):
    concept_id: str
    concept_label: str
    class_average_readiness: float
    students_below_threshold: int
    downstream_concepts: list[str]
    impact: float
    recommended_action: str


class AggregateItem(BaseModel):
    concept_id: str
    concept_label: str
    mean_readiness: float
    median_readiness: float
    std_readiness: float
    below_threshold_count: int


class DashboardResponse(BaseModel):
    heatmap: list[HeatmapCell] = []
    alerts: list[AlertItem] = []
    aggregates: list[AggregateItem] = []


# ---------------------------------------------------------------------------
# Trace
# ---------------------------------------------------------------------------

class UpstreamContribution(BaseModel):
    concept_id: str
    concept_label: str
    readiness: float
    contribution_weight: float
    penalty_contribution: float


class DownstreamContribution(BaseModel):
    concept_id: str
    concept_label: str
    readiness: float
    boost_contribution: float


class WaterfallStep(BaseModel):
    label: str
    value: float
    cumulative: float


class TraceResponse(BaseModel):
    concept_id: str
    concept_label: str
    direct_readiness: Optional[float]
    upstream: list[UpstreamContribution] = []
    downstream: list[DownstreamContribution] = []
    waterfall: list[WaterfallStep] = []
    students_affected: int = 0


# ---------------------------------------------------------------------------
# Clusters
# ---------------------------------------------------------------------------

class ClusterItem(BaseModel):
    id: UUID
    cluster_label: str
    student_count: int
    centroid: dict[str, float] = {}
    top_weak_concepts: list[str] = []
    suggested_interventions: list[str] = []


class ClusterAssignmentSummary(BaseModel):
    student_id: str
    cluster_label: str


class ClustersResponse(BaseModel):
    clusters: list[ClusterItem] = []
    assignments_summary: list[ClusterAssignmentSummary] = []


# ---------------------------------------------------------------------------
# Student Report
# ---------------------------------------------------------------------------

class StudentConceptReadiness(BaseModel):
    concept_id: str
    concept_label: str
    direct_readiness: Optional[float]
    final_readiness: float
    confidence: str


class WeakConceptItem(BaseModel):
    concept_id: str
    concept_label: str
    readiness: float
    confidence: str


class StudyPlanItem(BaseModel):
    concept_id: str
    concept_label: str
    readiness: float
    confidence: str
    reason: str
    explanation: str


class StudentReportResponse(BaseModel):
    student_id: str
    exam_id: UUID
    concept_graph: dict[str, Any] = {}
    readiness: list[StudentConceptReadiness] = []
    top_weak_concepts: list[WeakConceptItem] = []
    study_plan: list[StudyPlanItem] = []


# ---------------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------------

class ParametersSchema(BaseModel):
    alpha: float = Field(1.0, ge=0.0, le=5.0)
    beta: float = Field(0.3, ge=0.0, le=5.0)
    gamma: float = Field(0.2, ge=0.0, le=5.0)
    threshold: float = Field(0.6, ge=0.0, le=1.0)


class ParametersResponse(BaseModel):
    status: str = "ok"
    alpha: float
    beta: float
    gamma: float
    threshold: float

    model_config = {"from_attributes": True}

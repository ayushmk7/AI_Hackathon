"""ConceptLens FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    clusters,
    compute,
    courses,
    dashboard,
    exams,
    graph,
    parameters,
    reports,
    upload,
)

app = FastAPI(
    title="ConceptLens API",
    description=(
        "Backend API for ConceptLens — a concept readiness analysis platform "
        "for instructors and students. Computes per-student concept readiness "
        "scores using a DAG-based inference engine, provides instructor "
        "dashboards with heatmaps and root-cause tracing, and generates "
        "personalized student reports."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS middleware (allow all origins for development)
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Include routers
# ---------------------------------------------------------------------------

app.include_router(courses.router)
app.include_router(exams.router)
app.include_router(upload.router)
app.include_router(graph.router)
app.include_router(compute.router)
app.include_router(dashboard.router)
app.include_router(clusters.router)
app.include_router(reports.router)
app.include_router(parameters.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "conceptlens-api"}

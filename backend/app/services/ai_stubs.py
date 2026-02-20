"""AI/ML integration stubs for future LLM-assisted features.

These functions are placeholders that will be implemented in Phase 2
when LMS integration and LLM-assisted features are added.
"""

from typing import Any


async def suggest_concept_tags(question_text: str) -> list[dict[str, Any]]:
    """Given question text, suggest concept tags using an LLM.

    TODO: Implement with OpenAI API or similar LLM.
    - Parse the question text
    - Identify relevant mathematical/scientific concepts
    - Return suggested concept IDs with confidence scores

    Args:
        question_text: The full text of the exam question.

    Returns:
        List of suggested concept tags, e.g.:
        [{"concept_id": "C_derivatives", "confidence": 0.9, "reason": "..."}]
    """
    return []


async def suggest_prerequisite_edges(
    concepts: list[str],
) -> list[dict[str, Any]]:
    """Given a list of concepts, suggest prerequisite edges using an LLM.

    TODO: Implement with OpenAI API or similar LLM.
    - Analyze the concepts for logical prerequisite relationships
    - Suggest directed edges with weights
    - Provide rationale for each suggested edge

    Args:
        concepts: List of concept IDs or labels.

    Returns:
        List of suggested edges, e.g.:
        [{"source": "C_limits", "target": "C_derivatives", "weight": 0.7,
          "rationale": "Understanding limits is prerequisite to derivatives"}]
    """
    return []


async def generate_cluster_interventions(
    cluster_centroid: dict[str, float],
    weak_concepts: list[str],
) -> list[str]:
    """Generate AI-powered intervention suggestions for a student cluster.

    TODO: Implement with OpenAI API or similar LLM.
    - Analyze the cluster's weakness pattern
    - Generate targeted, specific interventions
    - Consider concept relationships and learning progressions

    Args:
        cluster_centroid: Concept ID -> readiness score mapping for the cluster center.
        weak_concepts: Top weak concepts for this cluster.

    Returns:
        List of intervention recommendation strings.
    """
    return [
        f"Review session recommended for '{c}' — consider practice problems and targeted exercises."
        for c in weak_concepts
    ]

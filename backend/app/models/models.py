"""SQLAlchemy ORM models for all 13 database tables."""

import uuid
from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.database import Base


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _uuid():
    return uuid.uuid4()


def _now():
    return datetime.utcnow()


# ---------------------------------------------------------------------------
# Courses & Exams
# ---------------------------------------------------------------------------

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)

    exams = relationship("Exam", back_populates="course", cascade="all, delete-orphan")


class Exam(Base):
    __tablename__ = "exams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)

    course = relationship("Course", back_populates="exams")
    concept_graphs = relationship("ConceptGraph", back_populates="exam", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="exam", cascade="all, delete-orphan")
    readiness_results = relationship("ReadinessResult", back_populates="exam", cascade="all, delete-orphan")
    class_aggregates = relationship("ClassAggregate", back_populates="exam", cascade="all, delete-orphan")
    clusters = relationship("Cluster", back_populates="exam", cascade="all, delete-orphan")
    cluster_assignments = relationship("ClusterAssignment", back_populates="exam", cascade="all, delete-orphan")
    student_tokens = relationship("StudentToken", back_populates="exam", cascade="all, delete-orphan")
    parameters = relationship("Parameter", back_populates="exam", uselist=False, cascade="all, delete-orphan")


# ---------------------------------------------------------------------------
# Concept Graphs
# ---------------------------------------------------------------------------

class ConceptGraph(Base):
    __tablename__ = "concept_graphs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    version = Column(Integer, nullable=False, default=1)
    graph_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)

    exam = relationship("Exam", back_populates="concept_graphs")


# ---------------------------------------------------------------------------
# Questions & Concept Mapping
# ---------------------------------------------------------------------------

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    question_id_external = Column(String(255), nullable=False)
    max_score = Column(Float, nullable=False, default=1.0)

    exam = relationship("Exam", back_populates="questions")
    concept_maps = relationship("QuestionConceptMap", back_populates="question", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="question", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("exam_id", "question_id_external", name="uq_question_exam_external"),
    )


class QuestionConceptMap(Base):
    __tablename__ = "question_concept_map"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    concept_id = Column(String(255), nullable=False)
    weight = Column(Float, nullable=False, default=1.0)

    question = relationship("Question", back_populates="concept_maps")


# ---------------------------------------------------------------------------
# Scores
# ---------------------------------------------------------------------------

class Score(Base):
    __tablename__ = "scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    student_id_external = Column(String(255), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)

    exam = relationship("Exam", back_populates="scores")
    question = relationship("Question", back_populates="scores")

    __table_args__ = (
        UniqueConstraint("exam_id", "student_id_external", "question_id", name="uq_score_student_question"),
    )


# ---------------------------------------------------------------------------
# Readiness Results
# ---------------------------------------------------------------------------

class ReadinessResult(Base):
    __tablename__ = "readiness_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    student_id_external = Column(String(255), nullable=False)
    concept_id = Column(String(255), nullable=False)
    direct_readiness = Column(Float, nullable=True)
    prerequisite_penalty = Column(Float, nullable=False, default=0.0)
    downstream_boost = Column(Float, nullable=False, default=0.0)
    final_readiness = Column(Float, nullable=False)
    confidence = Column(String(10), nullable=False)  # "high", "medium", "low"
    explanation_trace_json = Column(JSONB, nullable=True)

    exam = relationship("Exam", back_populates="readiness_results")

    __table_args__ = (
        UniqueConstraint("exam_id", "student_id_external", "concept_id", name="uq_readiness_student_concept"),
    )


# ---------------------------------------------------------------------------
# Class Aggregates
# ---------------------------------------------------------------------------

class ClassAggregate(Base):
    __tablename__ = "class_aggregates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    concept_id = Column(String(255), nullable=False)
    mean_readiness = Column(Float, nullable=False)
    median_readiness = Column(Float, nullable=False)
    std_readiness = Column(Float, nullable=False)
    below_threshold_count = Column(Integer, nullable=False)

    exam = relationship("Exam", back_populates="class_aggregates")

    __table_args__ = (
        UniqueConstraint("exam_id", "concept_id", name="uq_aggregate_exam_concept"),
    )


# ---------------------------------------------------------------------------
# Clusters
# ---------------------------------------------------------------------------

class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    cluster_label = Column(String(100), nullable=False)
    centroid_json = Column(JSONB, nullable=True)
    student_count = Column(Integer, nullable=False, default=0)

    exam = relationship("Exam", back_populates="clusters")
    assignments = relationship("ClusterAssignment", back_populates="cluster", cascade="all, delete-orphan")


class ClusterAssignment(Base):
    __tablename__ = "cluster_assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    student_id_external = Column(String(255), nullable=False)
    cluster_id = Column(UUID(as_uuid=True), ForeignKey("clusters.id", ondelete="CASCADE"), nullable=False)

    exam = relationship("Exam", back_populates="cluster_assignments")
    cluster = relationship("Cluster", back_populates="assignments")

    __table_args__ = (
        UniqueConstraint("exam_id", "student_id_external", name="uq_cluster_assignment_student"),
    )


# ---------------------------------------------------------------------------
# Student Tokens
# ---------------------------------------------------------------------------

class StudentToken(Base):
    __tablename__ = "student_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    student_id_external = Column(String(255), nullable=False)
    token = Column(UUID(as_uuid=True), default=_uuid, unique=True, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)

    exam = relationship("Exam", back_populates="student_tokens")

    __table_args__ = (
        UniqueConstraint("exam_id", "student_id_external", name="uq_token_exam_student"),
    )


# ---------------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------------

class Parameter(Base):
    __tablename__ = "parameters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False, unique=True)
    alpha = Column(Float, nullable=False, default=1.0)
    beta = Column(Float, nullable=False, default=0.3)
    gamma = Column(Float, nullable=False, default=0.2)
    threshold = Column(Float, nullable=False, default=0.6)

    exam = relationship("Exam", back_populates="parameters")

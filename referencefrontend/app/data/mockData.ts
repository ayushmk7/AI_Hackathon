// Mock data for ConceptLens application
// This data simulates a Calculus II course with 10 concepts and 45 students
// In production, this would be fetched from a backend API

export interface ConceptNode {
  id: string;
  name: string;
  readiness: number;
  depth: number;
  prerequisites: string[];
  x?: number;
  y?: number;
}

export interface Student {
  id: string;
  name: string;
  conceptReadiness: Record<string, number>;
}

export interface Alert {
  id: string;
  conceptId: string;
  conceptName: string;
  severity: 'high' | 'medium' | 'low';
  impact: number;
  studentsAffected: number;
  message: string;
}

export interface WaterfallItem {
  label: string;
  value: number;
  type: 'positive' | 'negative' | 'total';
}

// Concept graph data
export const concepts: ConceptNode[] = [
  { id: 'c1', name: 'Limits', readiness: 0.82, depth: 0, prerequisites: [], x: 200, y: 100 },
  { id: 'c2', name: 'Continuity', readiness: 0.75, depth: 1, prerequisites: ['c1'], x: 200, y: 200 },
  { id: 'c3', name: 'Derivatives', readiness: 0.68, depth: 1, prerequisites: ['c1'], x: 400, y: 200 },
  { id: 'c4', name: 'Chain Rule', readiness: 0.45, depth: 2, prerequisites: ['c3'], x: 400, y: 300 },
  { id: 'c5', name: 'Integration', readiness: 0.71, depth: 2, prerequisites: ['c3'], x: 600, y: 300 },
  { id: 'c6', name: 'FTC', readiness: 0.38, depth: 3, prerequisites: ['c5', 'c4'], x: 500, y: 400 },
  { id: 'c7', name: 'Series', readiness: 0.63, depth: 2, prerequisites: ['c2'], x: 200, y: 300 },
  { id: 'c8', name: 'Taylor Series', readiness: 0.42, depth: 3, prerequisites: ['c7', 'c3'], x: 300, y: 400 },
  { id: 'c9', name: 'Optimization', readiness: 0.55, depth: 3, prerequisites: ['c4'], x: 400, y: 500 },
  { id: 'c10', name: 'Partial Derivatives', readiness: 0.59, depth: 3, prerequisites: ['c3'], x: 600, y: 400 },
];

// Heatmap data: students × concepts
export const students: Student[] = Array.from({ length: 45 }, (_, i) => ({
  id: `s${i + 1}`,
  name: `Student ${i + 1}`,
  conceptReadiness: concepts.reduce((acc, concept) => {
    acc[concept.id] = Math.random() * 0.4 + 0.4; // 0.4 to 0.8
    return acc;
  }, {} as Record<string, number>),
}));

// Alerts for intervention
export const alerts: Alert[] = [
  {
    id: 'a1',
    conceptId: 'c6',
    conceptName: 'Fundamental Theorem of Calculus',
    severity: 'high',
    impact: 0.92,
    studentsAffected: 34,
    message: 'Critical prerequisite gap: Integration foundations weak',
  },
  {
    id: 'a2',
    conceptId: 'c4',
    conceptName: 'Chain Rule',
    severity: 'high',
    impact: 0.87,
    studentsAffected: 28,
    message: 'Cascading failure from derivative fundamentals',
  },
  {
    id: 'a3',
    conceptId: 'c8',
    conceptName: 'Taylor Series',
    severity: 'medium',
    impact: 0.73,
    studentsAffected: 22,
    message: 'Series convergence understanding below threshold',
  },
  {
    id: 'a4',
    conceptId: 'c9',
    conceptName: 'Optimization',
    severity: 'medium',
    impact: 0.68,
    studentsAffected: 19,
    message: 'Application struggles despite theoretical readiness',
  },
  {
    id: 'a5',
    conceptId: 'c10',
    conceptName: 'Partial Derivatives',
    severity: 'low',
    impact: 0.55,
    studentsAffected: 15,
    message: 'Notation confusion affecting multivariate calculus',
  },
];

// Waterfall data for root cause trace
export const getWaterfallData = (conceptId: string): WaterfallItem[] => {
  const concept = concepts.find(c => c.id === conceptId);
  if (!concept) return [];

  return [
    { label: 'Direct Readiness', value: 0.62, type: 'positive' },
    { label: 'Integration Gap', value: -0.15, type: 'negative' },
    { label: 'Chain Rule Gap', value: -0.09, type: 'negative' },
    { label: 'Prerequisite Penalty', value: -0.24, type: 'negative' },
    { label: 'Final Readiness', value: concept.readiness, type: 'total' },
  ];
};

// Heatmap matrix data
export const getHeatmapData = () => {
  return concepts.map(concept => ({
    concept: concept.name,
    ...students.slice(0, 15).reduce((acc, student, idx) => {
      acc[`s${idx}`] = student.conceptReadiness[concept.id] || 0;
      return acc;
    }, {} as Record<string, number>),
  }));
};

// Study plan for student report
export const getStudyPlan = (studentId: string) => {
  const student = students.find(s => s.id === studentId);
  if (!student) return [];

  const weakConcepts = concepts
    .map(c => ({
      ...c,
      studentReadiness: student.conceptReadiness[c.id] || 0,
    }))
    .filter(c => c.studentReadiness < 0.6)
    .sort((a, b) => a.depth - b.depth);

  return weakConcepts.map(c => ({
    id: c.id,
    name: c.name,
    currentLevel: c.studentReadiness,
    targetLevel: 0.8,
    priority: c.studentReadiness < 0.45 ? 'high' : c.studentReadiness < 0.55 ? 'medium' : 'low',
    prerequisites: c.prerequisites.map(pid => concepts.find(pc => pc.id === pid)?.name || ''),
  }));
};

// Parameter defaults
export const defaultParameters = {
  alpha: 0.6,
  beta: 0.3,
  gamma: 0.1,
  threshold: 0.5,
};

// Filter options (populate from API in production)
export const courses: string[] = [];
export const exams: string[] = [];
export const semesters: string[] = [];

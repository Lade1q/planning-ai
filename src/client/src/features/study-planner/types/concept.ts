export interface Concept {
  id: string;
  name: string;
  description?: string;
  mastery_score: number | null; // null means untested
  difficulty?: number | null;
}

export interface ConceptEdge {
  id: string;
  source: string; // ID of the prerequisite concept
  target: string; // ID of the target concept
}

export interface PlanGraph {
  concepts: Concept[];
  edges: ConceptEdge[];
}

/**
 * The three values of the backend's `StudyPlanStatus` enum — no more, no less.
 * (There is no `completed`: a plan the user is done with is `archived`, SP-04.)
 */
export type PlanStatus = 'draft' | 'active' | 'archived';

export type AnalysisStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface PlanDetails {
  id: string;
  name: string;
  deadline?: string;
  status: PlanStatus;
  analysisStatus?: AnalysisStatus | null;
  dagAutoFixed?: boolean;
  graph: PlanGraph;
}

/** Concepts per mastery band. Sums to `conceptCount`; `untested` is never folded into `weak`. */
export interface MasteryDistribution {
  strong: number;
  learning: number;
  weak: number;
  untested: number;
}

/** One row of `GET /plans` — everything a plan card on SP-03 draws, with no follow-up call. */
export interface PlanSummary {
  id: string;
  name: string;
  deadline: string | null;
  status: PlanStatus;
  conceptCount: number;
  masteryDistribution: MasteryDistribution;
  analysisStatus: AnalysisStatus | null;
  analysisStartedAt: string | null;
  document: { filename: string; pageCount: number | null } | null;
  createdAt: string;
}

// Backend Response Types
export interface BackendConcept {
  id: string;
  name: string;
  difficulty: number | null;
  masteryScore: number | null;
}

export interface BackendEdge {
  id: string;
  fromConceptId: string;
  toConceptId: string;
}

export interface BackendPlanDetails {
  id: string;
  userId: string;
  name: string;
  deadline: string;
  status: PlanStatus;
  analysisStatus: AnalysisStatus | null;
  dagAutoFixed: boolean;
  concepts: BackendConcept[];
  edges: BackendEdge[];
}

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

export interface PlanDetails {
  id: string;
  name: string;
  deadline?: string;
  status: 'draft' | 'active' | 'completed';
  analysisStatus?: 'pending' | 'processing' | 'done' | 'failed' | null;
  dagAutoFixed?: boolean;
  graph: PlanGraph;
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
  status: 'draft' | 'active' | 'completed';
  analysisStatus: 'pending' | 'processing' | 'done' | 'failed' | null;
  dagAutoFixed: boolean;
  concepts: BackendConcept[];
  edges: BackendEdge[];
}

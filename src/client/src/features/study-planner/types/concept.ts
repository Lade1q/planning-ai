export interface Concept {
  id: string;
  name: string;
  description?: string;
  mastery_score: number | null; // null means untested
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
  graph: PlanGraph;
}

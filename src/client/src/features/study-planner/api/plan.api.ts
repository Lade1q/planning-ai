import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import { Concept, ConceptEdge, PlanDetails, BackendPlanDetails } from '../types/concept';

export interface CreatePlanResponse {
  planId: string;
}

interface BackendCreatePlanResponse {
  success: boolean;
  data: {
    plan: {
      id: string;
    };
    message: string;
  };
}

export const planApi = {
  createPlan: async (formData: FormData): Promise<CreatePlanResponse> => {
    const response = await apiClient.post<BackendCreatePlanResponse>(ENDPOINTS.PLANS.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      planId: response.data.data.plan.id,
    };
  },

  getPlan: async (id: string): Promise<PlanDetails> => {
    const response = await apiClient.get<{ success: boolean; data: BackendPlanDetails }>(`${ENDPOINTS.PLANS.BASE}/${id}`);
    const backendData = response.data.data;

    const mappedConcepts: Concept[] = backendData.concepts.map(c => ({
      id: c.id,
      name: c.name,
      difficulty: c.difficulty,
      mastery_score: c.masteryScore,
    }));

    const mappedEdges: ConceptEdge[] = backendData.edges.map(e => ({
      id: e.id,
      source: e.fromConceptId,
      target: e.toConceptId,
    }));

    return {
      id: backendData.id,
      name: backendData.name,
      deadline: backendData.deadline,
      status: backendData.status,
      analysisStatus: backendData.analysisStatus,
      dagAutoFixed: backendData.dagAutoFixed,
      graph: {
        concepts: mappedConcepts,
        edges: mappedEdges,
      }
    };
  },

  updatePlanGraph: async (id: string, concepts: Concept[], edges: ConceptEdge[]): Promise<{ success: boolean }> => {
    // Backend PUT expects concepts: [{name, difficulty}], edges: [{from, to}] referencing by NAME.
    const nameMap = new Map<string, string>();
    concepts.forEach(c => nameMap.set(c.id, c.name));

    const backendConcepts = concepts.map(c => ({
      name: c.name,
      difficulty: c.difficulty
    }));

    const backendEdges = edges.map(e => ({
      from: nameMap.get(e.source) || e.source,
      to: nameMap.get(e.target) || e.target,
    }));

    const response = await apiClient.put<{ success: boolean }>(`${ENDPOINTS.PLANS.BASE}/${id}/graph`, {
      concepts: backendConcepts,
      edges: backendEdges,
    });
    return response.data;
  },
};

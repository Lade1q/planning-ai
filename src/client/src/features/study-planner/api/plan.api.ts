import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import { Concept, ConceptEdge } from '../types/concept';

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

export interface PlanDetails {
  id: string;
  name: string;
  deadline: string;
  status: 'draft' | 'active' | 'completed';
  graph: {
    concepts: Concept[];
    edges: ConceptEdge[];
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
    const response = await apiClient.get<{ success: boolean; data: PlanDetails }>(`${ENDPOINTS.PLANS.BASE}/${id}`);
    return response.data.data;
  },

  updatePlanGraph: async (id: string, concepts: Concept[], edges: ConceptEdge[]): Promise<{ success: boolean }> => {
    const response = await apiClient.put<{ success: boolean }>(`${ENDPOINTS.PLANS.BASE}/${id}/graph`, {
      concepts,
      edges,
    });
    return response.data;
  },
};

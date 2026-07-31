import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import {
  Concept,
  ConceptEdge,
  PlanDetails,
  BackendPlanDetails,
  PlanSummary,
} from '../types/concept';

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
  listPlans: async (): Promise<PlanSummary[]> => {
    const response = await apiClient.get<{ success: boolean; data: { plans: PlanSummary[] } }>(
      ENDPOINTS.PLANS.BASE
    );
    return response.data.data.plans;
  },

  createPlan: async (formData: FormData): Promise<CreatePlanResponse> => {
    const response = await apiClient.post<BackendCreatePlanResponse>(
      ENDPOINTS.PLANS.BASE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return {
      planId: response.data.data.plan.id,
    };
  },

  getPlan: async (id: string): Promise<PlanDetails> => {
    const response = await apiClient.get<{ success: boolean; data: BackendPlanDetails }>(
      `${ENDPOINTS.PLANS.BASE}/${id}`
    );
    const backendData = response.data.data;

    const mappedConcepts: Concept[] = backendData.concepts.map((c) => ({
      id: c.id,
      name: c.name,
      difficulty: c.difficulty,
      mastery_score: c.masteryScore,
    }));

    const mappedEdges: ConceptEdge[] = backendData.edges.map((e) => ({
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
      },
    };
  },

  updatePlanGraph: async (
    id: string,
    concepts: Concept[],
    edges: ConceptEdge[]
  ): Promise<{ success: boolean; data?: { status: string } }> => {
    // Backend PUT expects concepts: [{name, difficulty}], edges: [{from, to}] referencing by NAME.
    const nameMap = new Map<string, string>();
    concepts.forEach((c) => nameMap.set(c.id, c.name));

    const backendConcepts = concepts.map((c) => {
      const payload: { name: string; difficulty?: number } = { name: c.name };
      if (c.difficulty != null) {
        payload.difficulty = c.difficulty;
      }
      return payload;
    });

    const backendEdges = edges.map((e) => ({
      from: nameMap.get(e.source) || e.source,
      to: nameMap.get(e.target) || e.target,
    }));

    const response = await apiClient.put<{ success: boolean; data?: { status: string } }>(
      `${ENDPOINTS.PLANS.BASE}/${id}/graph`,
      {
        concepts: backendConcepts,
        edges: backendEdges,
        confirm: true,
      }
    );
    return response.data;
  },

  /** Archive a plan (SP-04), or pull an archived one back to active. */
  setPlanStatus: async (id: string, status: 'active' | 'archived'): Promise<void> => {
    await apiClient.patch(ENDPOINTS.PLANS.DETAIL(id), { status });
  },

  /**
   * Queue a fresh analysis of an active plan's document (SP-05). Returns as soon as the job
   * is queued — the caller polls the list, same as the create flow.
   */
  reanalyzePlan: async (id: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.PLANS.REANALYZE(id));
  },

  /** Permanent, cascading delete (SP-04). No undo. */
  deletePlan: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PLANS.DETAIL(id));
  },
};

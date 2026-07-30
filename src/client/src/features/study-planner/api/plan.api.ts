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

const MOCK_CONCEPTS: Concept[] = [
  { id: '1', name: 'Cây (Tree)', description: '', mastery_score: null },
  { id: '2', name: 'Ngăn xếp (Stack)', description: '', mastery_score: null },
  { id: '3', name: 'Đồ thị (Graph)', description: '', mastery_score: null },
  { id: '4', name: 'DFS', description: '', mastery_score: null },
  { id: '5', name: 'BFS', description: '', mastery_score: null },
];

const MOCK_EDGES: ConceptEdge[] = [
  { id: 'e1', source: '1', target: '3' },
  { id: 'e2', source: '2', target: '4' },
  { id: 'e3', source: '3', target: '4' },
  { id: 'e4', source: '3', target: '5' },
];

// Helper for DAG validation in mock
function hasCycleInMock(edges: ConceptEdge[]): boolean {
  const adjList = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!adjList.has(e.source)) adjList.set(e.source, []);
    adjList.get(e.source)!.push(e.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(node: string): boolean {
    if (recursionStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recursionStack.add(node);

    const neighbors = adjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    recursionStack.delete(node);
    return false;
  }

  const nodes = new Set<string>();
  edges.forEach(e => { nodes.add(e.source); nodes.add(e.target); });

  for (const node of nodes) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

// TODO: Xóa khi Backend sẵn sàng — in-memory store để mock persist status
const mockPlanStore = new Map<string, { status: PlanDetails['status']; concepts: Concept[]; edges: ConceptEdge[] }>();

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
    // TODO: Thay thế bằng API thật khi Backend sẵn sàng
    const persisted = mockPlanStore.get(id);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: 'Kế hoạch học Cấu trúc Dữ liệu',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: persisted?.status ?? 'draft',
          graph: {
            concepts: persisted?.concepts ?? [...MOCK_CONCEPTS],
            edges: persisted?.edges ?? [...MOCK_EDGES],
          },
        });
      }, 500);
    });
  },

  updatePlanGraph: async (id: string, concepts: Concept[], edges: ConceptEdge[]): Promise<{ success: boolean }> => {
    // TODO: Thay thế bằng API thật khi Backend sẵn sàng
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (hasCycleInMock(edges)) {
          reject(new Error("Cycle detected"));
        } else {
          // Persist graph + status change in-memory (draft → active)
          mockPlanStore.set(id, { status: 'active', concepts, edges });
          console.log(`[Mock API] Updated graph for plan ${id}`, { concepts, edges });
          resolve({ success: true });
        }
      }, 600);
    });
  },
};

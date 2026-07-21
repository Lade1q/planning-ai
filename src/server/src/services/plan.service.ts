import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { CreatePlanInput } from '../schemas/plan.schema';
import { CreatePlanResponse, PlanItemResponse, PlanDetailResponse } from '../types/plan.types';

/**
 * Creates a new StudyPlan (draft status) and associated AnalysisJob (pending status) atomically.
 */
export async function createPlan(
  userId: string,
  input: CreatePlanInput,
  filePath: string
): Promise<CreatePlanResponse> {
  const deadlineDate = new Date(input.deadline);

  const result = await prisma.$transaction(async (tx) => {
    const plan = await tx.studyPlan.create({
      data: {
        userId,
        name: input.name,
        deadline: deadlineDate,
        status: 'draft',
      },
    });

    await tx.analysisJob.create({
      data: {
        planDraftId: plan.id,
        filePath,
        status: 'pending',
      },
    });

    return plan;
  });

  return {
    id: result.id,
    name: result.name,
    deadline: result.deadline,
    status: result.status,
  };
}

/**
 * Fetches all study plans for a given user.
 */
export async function getUserPlans(userId: string): Promise<PlanItemResponse[]> {
  const plans = await prisma.studyPlan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      deadline: true,
      status: true,
      createdAt: true,
      _count: {
        select: { concepts: true },
      },
    },
  });

  return plans.map((p) => ({
    id: p.id,
    name: p.name,
    deadline: p.deadline,
    status: p.status,
    conceptCount: p._count.concepts,
    createdAt: p.createdAt,
  }));
}

/**
 * Fetches details of a specific study plan by ID with ownership verification.
 */
export async function getPlanById(planId: string, userId: string): Promise<PlanDetailResponse> {
  const plan = await prisma.studyPlan.findUnique({
    where: { id: planId },
    include: {
      concepts: {
        select: {
          id: true,
          name: true,
          difficulty: true,
          masteryScore: true,
          source: true,
          status: true,
          createdAt: true,
        },
      },
      conceptEdges: {
        select: {
          id: true,
          fromConceptId: true,
          toConceptId: true,
        },
      },
    },
  });

  if (!plan) {
    throw new AppError('Study plan not found', 404, 'NOT_FOUND');
  }

  if (plan.userId !== userId) {
    throw new AppError('Access denied to this study plan', 403, 'FORBIDDEN');
  }

  return {
    id: plan.id,
    userId: plan.userId,
    name: plan.name,
    deadline: plan.deadline,
    status: plan.status,
    dagAutoFixed: plan.dagAutoFixed,
    tracebackEnabled: plan.tracebackEnabled,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
    concepts: plan.concepts,
    edges: plan.conceptEdges,
  };
}

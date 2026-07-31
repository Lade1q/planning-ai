import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { CreatePlanInput } from '../schemas/plan.schema';
import { createStorageService } from './storage.service';
import { STALE_JOB_THRESHOLD_MS } from './analysis.service';
import {
  CreatePlanResponse,
  PlanItemResponse,
  PlanDetailResponse,
  RetryPlanResponse,
  DocumentMeta,
} from '../types/plan.types';

const storageService = createStorageService();

/**
 * Creates a new StudyPlan (draft), its source Document, and the pending AnalysisJob
 * atomically. The Document is the durable home for the uploaded file (it outlives the
 * transient AnalysisJob); concept_sources are anchored to it later during analysis.
 */
export async function createPlanInDb(
  userId: string,
  planId: string,
  input: CreatePlanInput,
  document: DocumentMeta
): Promise<CreatePlanResponse> {
  const dateStr = input.deadline.includes('T') ? input.deadline.split('T')[0] : input.deadline;
  const deadlineDate = new Date(`${dateStr}T23:59:59.999Z`);

  const result = await prisma.$transaction(async (tx) => {
    const plan = await tx.studyPlan.create({
      data: {
        id: planId,
        userId,
        name: input.name,
        deadline: deadlineDate,
        status: 'draft',
      },
    });

    await tx.document.create({
      data: {
        planId: plan.id,
        filename: document.filename,
        fileKey: document.fileKey,
        kind: document.kind,
        pageCount: document.pageCount,
        byteSize: document.byteSize,
      },
    });

    await tx.analysisJob.create({
      data: {
        planDraftId: plan.id,
        fileKey: document.fileKey,
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
  // AnalysisJob has no FK relation to StudyPlan (async draft flow), so its status
  // is fetched separately — latest job by createdAt, since SP-05 re-analyze can add more.
  const [plan, latestJob] = await Promise.all([
    prisma.studyPlan.findUnique({
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
    }),
    prisma.analysisJob.findFirst({
      where: { planDraftId: planId },
      orderBy: { createdAt: 'desc' },
      select: { status: true },
    }),
  ]);

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
    analysisStatus: latestJob?.status ?? null,
    dagAutoFixed: plan.dagAutoFixed,
    tracebackEnabled: plan.tracebackEnabled,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
    concepts: plan.concepts,
    edges: plan.conceptEdges,
  };
}

/**
 * Creates a new AnalysisJob for a failed plan, reusing the original fileKey
 * so the user does not need to re-upload. Validates ownership and that the
 * latest job is in `failed` state before proceeding (Issue #106) — a stuck
 * `pending`/`processing` job past STALE_JOB_THRESHOLD_MS is treated the same
 * as `failed` so it doesn't block retry forever (Issue #178).
 *
 * Uses SELECT FOR UPDATE to serialize concurrent retry requests on the same
 * plan — prevents two pending jobs from being created simultaneously.
 */
export async function retryPlanAnalysis(
  planId: string,
  userId: string
): Promise<RetryPlanResponse> {
  return prisma.$transaction(async (tx) => {
    // Lock the plan row — a second concurrent request will block here
    // until this transaction commits or rolls back.
    await tx.$queryRaw`SELECT id FROM study_plans WHERE id = ${planId}::uuid FOR UPDATE`;

    // 1. Fetch plan — reuse the same query pattern as getPlanById
    const plan = await tx.studyPlan.findUnique({
      where: { id: planId },
      select: { id: true, userId: true, name: true, deadline: true, status: true },
    });

    if (!plan) {
      throw new AppError('Study plan not found', 404, 'NOT_FOUND');
    }

    if (plan.userId !== userId) {
      throw new AppError('Access denied to this study plan', 403, 'FORBIDDEN');
    }

    // Guard: only draft plans can be retried — active plans already have concepts,
    // and processAnalysisJob only INSERTs (no DELETE), causing duplicates.
    if (plan.status !== 'draft') {
      throw new AppError('Retry is only allowed for draft plans', 409, 'RETRY_NOT_ALLOWED');
    }

    // 2. Find latest AnalysisJob — must be `failed` (or stale `pending`/`processing`,
    // Issue #178) to allow retry.
    const latestJob = await tx.analysisJob.findFirst({
      where: { planDraftId: planId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, fileKey: true, createdAt: true },
    });

    if (!latestJob) {
      throw new AppError('No analysis job found for this plan', 409, 'RETRY_NOT_ALLOWED');
    }

    if (latestJob.status === 'pending' || latestJob.status === 'processing') {
      const isStale = Date.now() - latestJob.createdAt.getTime() > STALE_JOB_THRESHOLD_MS;
      if (!isStale) {
        throw new AppError('An analysis is already in progress', 409, 'RETRY_NOT_ALLOWED');
      }
      // Stuck past the threshold — release it so retry is not blocked forever (#178).
      await tx.analysisJob.update({
        where: { id: latestJob.id },
        data: { status: 'failed', completedAt: new Date() },
      });
    } else if (latestJob.status !== 'failed') {
      throw new AppError('Plan analysis is not in a failed state', 409, 'RETRY_NOT_ALLOWED');
    }

    if (!latestJob.fileKey) {
      throw new AppError('Original file key is missing, cannot retry', 409, 'RETRY_NOT_ALLOWED');
    }

    // 3. Create new job within the same transaction — guaranteed no duplicate
    await tx.analysisJob.create({
      data: {
        planDraftId: planId,
        fileKey: latestJob.fileKey,
        status: 'pending',
      },
    });

    return {
      id: plan.id,
      name: plan.name,
      deadline: plan.deadline,
      status: plan.status,
      analysisStatus: 'pending' as const,
    };
  });
}

/**
 * Permanently deletes a study plan and all associated data.
 *
 * Cascade (via Prisma onDelete: Cascade) handles:
 *   Concept, ConceptEdge, InterviewSession → InterviewTurn,
 *   FocusSession, ReviewQueueItem, Document → ConceptSourceRef, QuestionCache.
 *
 * Manual cleanup required:
 *   - AnalysisJob: no FK constraint to StudyPlan (async draft flow by design).
 *   - Storage files: physical files referenced by Document.fileKey.
 */
export async function deletePlan(planId: string, userId: string): Promise<void> {
  // 1. Fetch plan with document file keys for later storage cleanup
  const plan = await prisma.studyPlan.findUnique({
    where: { id: planId },
    select: {
      userId: true,
      documents: { select: { fileKey: true } },
    },
  });

  if (!plan) {
    throw new AppError('Study plan not found', 404, 'NOT_FOUND');
  }

  if (plan.userId !== userId) {
    throw new AppError('Access denied to this study plan', 403, 'FORBIDDEN');
  }

  // 2. Collect file keys BEFORE deleting DB records (cascade will remove Document rows).
  //    We key cleanup off Document.fileKey (the durable home for the file); in every
  //    current flow each stored object also has a Document row, so a job that reuses the
  //    same fileKey points at the same object. A file referenced ONLY by an AnalysisJob
  //    (no matching Document) is not cleaned here — no such flow exists today.
  const fileKeys = plan.documents.map((d) => d.fileKey);

  // 3. Delete AnalysisJob (no FK → not cascade-deleted) + StudyPlan atomically.
  //    P2025 means the plan row was already removed between the fetch above and here
  //    (concurrent DELETE) — treat it as "not found" so the endpoint stays idempotent.
  try {
    await prisma.$transaction([
      prisma.analysisJob.deleteMany({ where: { planDraftId: planId } }),
      prisma.studyPlan.delete({ where: { id: planId } }),
    ]);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      throw new AppError('Study plan not found', 404, 'NOT_FOUND');
    }
    throw err;
  }

  // 4. Best-effort storage cleanup — DB is source of truth, don't fail the request
  const results = await Promise.allSettled(fileKeys.map((key) => storageService.delete(key)));

  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length > 0) {
    console.warn(
      `[deletePlan] Failed to cleanup ${failures.length}/${fileKeys.length} storage files for plan ${planId}`
    );
  }
}

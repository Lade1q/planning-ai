import { updatePlanStatus, isAnalysisInProgress } from '../services/plan.service';
import { STALE_JOB_THRESHOLD_MS } from '../services/analysis.service';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

// Mock Prisma client — same factory pattern as retry-plan.test.ts, so this stays a unit test
// that runs without DATABASE_URL/GEMINI_API_KEY (SDP risk R05).
jest.mock('../config/prisma', () => {
  const client = {
    studyPlan: { findUnique: jest.fn(), update: jest.fn() },
    analysisJob: { findFirst: jest.fn() },
  };
  return { __esModule: true, default: client };
});

jest.mock('../services/storage.service', () => ({
  __esModule: true,
  createStorageService: () => ({ delete: jest.fn(), upload: jest.fn() }),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

const OWNER_ID = 'user-owner-uuid';
const PLAN_ID = 'plan-uuid';

const draftPlan = { id: PLAN_ID, userId: OWNER_ID, status: 'draft' as const };

const archivedRow = {
  id: PLAN_ID,
  name: 'Kế hoạch ôn thi Giải tích',
  deadline: new Date('2026-08-30'),
  status: 'archived' as const,
  updatedAt: new Date('2026-08-06T09:00:00.000Z'),
};

function jobAgeMs(ms: number) {
  return new Date(Date.now() - ms);
}

/**
 * The rule the archive guard leans on (#265): `draft` alone no longer says whether a plan is
 * mid-analysis, so the job's own state has to answer that.
 */
describe('isAnalysisInProgress', () => {
  it('counts a fresh pending or processing job as running', () => {
    expect(isAnalysisInProgress({ status: 'pending', createdAt: jobAgeMs(1000) })).toBe(true);
    expect(isAnalysisInProgress({ status: 'processing', createdAt: jobAgeMs(1000) })).toBe(true);
  });

  it('does not count a finished job', () => {
    expect(isAnalysisInProgress({ status: 'done', createdAt: jobAgeMs(1000) })).toBe(false);
    expect(isAnalysisInProgress({ status: 'failed', createdAt: jobAgeMs(1000) })).toBe(false);
  });

  it('does not count a job stuck past the stale threshold (#178)', () => {
    const stuck = { status: 'processing', createdAt: jobAgeMs(STALE_JOB_THRESHOLD_MS + 1000) };
    expect(isAnalysisInProgress(stuck)).toBe(false);
  });

  it('treats a plan with no job at all as not running', () => {
    expect(isAnalysisInProgress(null)).toBe(false);
  });
});

describe('updatePlanStatus — draft plans (#265)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedPrisma.studyPlan.update as jest.Mock).mockResolvedValue(archivedRow);
  });

  it('archives a draft whose analysis has finished but was never confirmed', async () => {
    (mockedPrisma.studyPlan.findUnique as jest.Mock).mockResolvedValue(draftPlan);
    (mockedPrisma.analysisJob.findFirst as jest.Mock).mockResolvedValue({
      status: 'done',
      createdAt: jobAgeMs(60_000),
    });

    const result = await updatePlanStatus(PLAN_ID, OWNER_ID, 'archived');

    expect(result).toEqual(archivedRow);
    expect(mockedPrisma.studyPlan.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: PLAN_ID }, data: { status: 'archived' } })
    );
  });

  it('refuses to archive a draft while its analysis is still running', async () => {
    (mockedPrisma.studyPlan.findUnique as jest.Mock).mockResolvedValue(draftPlan);
    (mockedPrisma.analysisJob.findFirst as jest.Mock).mockResolvedValue({
      status: 'processing',
      createdAt: jobAgeMs(30_000),
    });

    const error = await updatePlanStatus(PLAN_ID, OWNER_ID, 'archived').catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      statusCode: 409,
      code: 'STATUS_TRANSITION_NOT_ALLOWED',
      message: 'A plan that is still being analysed cannot be archived',
    });
    expect(mockedPrisma.studyPlan.update).not.toHaveBeenCalled();
  });

  it('archives a draft whose analysis job is stuck past the stale threshold', async () => {
    (mockedPrisma.studyPlan.findUnique as jest.Mock).mockResolvedValue(draftPlan);
    (mockedPrisma.analysisJob.findFirst as jest.Mock).mockResolvedValue({
      status: 'processing',
      createdAt: jobAgeMs(STALE_JOB_THRESHOLD_MS + 60_000),
    });

    await updatePlanStatus(PLAN_ID, OWNER_ID, 'archived');

    expect(mockedPrisma.studyPlan.update).toHaveBeenCalled();
  });

  it('refuses to activate a draft — that is what confirming the graph is for', async () => {
    (mockedPrisma.studyPlan.findUnique as jest.Mock).mockResolvedValue(draftPlan);

    const error = await updatePlanStatus(PLAN_ID, OWNER_ID, 'active').catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      statusCode: 409,
      code: 'STATUS_TRANSITION_NOT_ALLOWED',
      message: 'A draft plan becomes active by confirming its concept graph',
    });
    // Refused on the status alone — no reason to ask about the job.
    expect(mockedPrisma.analysisJob.findFirst).not.toHaveBeenCalled();
    expect(mockedPrisma.studyPlan.update).not.toHaveBeenCalled();
  });

  it('leaves non-draft plans on the plain path, without a job lookup', async () => {
    (mockedPrisma.studyPlan.findUnique as jest.Mock).mockResolvedValue({
      ...draftPlan,
      status: 'active',
    });

    await updatePlanStatus(PLAN_ID, OWNER_ID, 'archived');

    expect(mockedPrisma.analysisJob.findFirst).not.toHaveBeenCalled();
    expect(mockedPrisma.studyPlan.update).toHaveBeenCalled();
  });

  it('still restores an archived plan to active', async () => {
    (mockedPrisma.studyPlan.findUnique as jest.Mock).mockResolvedValue({
      ...draftPlan,
      status: 'archived',
    });
    (mockedPrisma.studyPlan.update as jest.Mock).mockResolvedValue({
      ...archivedRow,
      status: 'active',
    });

    const result = await updatePlanStatus(PLAN_ID, OWNER_ID, 'active');

    expect(result.status).toBe('active');
  });
});

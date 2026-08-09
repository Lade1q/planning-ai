import { getSessionSummary } from '../services/session-summary.service';
import prisma from '../config/prisma';
import { loadSession } from '../services/interview.service';
import { summarizeSession } from '../services/gemini.service';
import { AppError } from '../middleware/errorHandler';

/**
 * AE-09 (I6.5) — `getSessionSummary()` against mocked Prisma / Gemini / `interview.service`.
 * `interview.service.ts` is a 900-line module with its own heavy dependency tree — mocked down
 * to the two functions this file actually reuses from it (`loadSession`, `parseConceptQueue`),
 * same DRY-reuse pattern as `question-cache.service.ts` reusing `loadMaterial`.
 */
jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: {
    concept: { findMany: jest.fn() },
    interviewTurn: { findMany: jest.fn() },
    reviewQueueItem: { findMany: jest.fn() },
    interviewSession: { update: jest.fn() },
  },
}));
jest.mock('../services/interview.service', () => ({
  loadSession: jest.fn(),
  parseConceptQueue: jest.fn((value: unknown) =>
    Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []
  ),
}));
jest.mock('../services/gemini.service', () => ({
  summarizeSession: jest.fn(),
}));

const mockedPrisma = prisma as unknown as {
  concept: { findMany: jest.Mock };
  interviewTurn: { findMany: jest.Mock };
  reviewQueueItem: { findMany: jest.Mock };
  interviewSession: { update: jest.Mock };
};
const mockedLoadSession = loadSession as jest.Mock;
const mockedSummarizeSession = summarizeSession as jest.Mock;

const SESSION_ID = 'session-uuid';
const USER_ID = 'user-uuid';
const CONCEPT_A = 'concept-a';
const CONCEPT_B = 'concept-b';
/** Traceback rows are all due immediately (AE-07 step 6), so they share one timestamp. */
const TRACEBACK_DUE = new Date('2026-08-04T10:12:00.000Z');

/** One `ReviewQueueItem` row as the widened `findMany` selects it (#119). */
function reviewRow(overrides: {
  conceptId: string;
  name: string;
  reason: 'traceback' | 'spaced_repetition';
  depth?: number | null;
  status?: string;
  scheduledFor?: Date | null;
  sourceConceptId?: string | null;
}) {
  const { name, ...rest } = overrides;
  return {
    depth: null,
    status: 'pending',
    scheduledFor: overrides.reason === 'traceback' ? TRACEBACK_DUE : null,
    sourceConceptId: null,
    ...rest,
    concept: { name },
  };
}

function baseSession(overrides: Record<string, unknown> = {}) {
  return {
    id: SESSION_ID,
    userId: USER_ID,
    planId: 'plan-uuid',
    status: 'completed',
    conceptQueue: [CONCEPT_A, CONCEPT_B],
    currentConceptIdx: 2,
    maxTurnsPerConcept: 3,
    fallbackMode: false,
    summaryText: null,
    startedAt: new Date('2026-08-04T10:00:00.000Z'),
    endedAt: new Date('2026-08-04T10:12:00.000Z'),
    plan: { languageDetected: 'vi' },
    ...overrides,
  };
}

describe('getSessionSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPrisma.concept.findMany.mockResolvedValue([
      { id: CONCEPT_A, name: 'Stack', masteryScore: 0.85 },
      { id: CONCEPT_B, name: 'Recursion', masteryScore: 0.4 },
    ]);
    mockedPrisma.interviewTurn.findMany.mockResolvedValue([
      { conceptId: CONCEPT_A, turnIndex: 1, score: 0.85, verdict: 'deep' },
      { conceptId: CONCEPT_B, turnIndex: 1, score: 0.4, verdict: 'wrong' },
    ]);
    mockedPrisma.reviewQueueItem.findMany.mockResolvedValue([]);
    mockedPrisma.interviewSession.update.mockResolvedValue({});
  });

  it('propagates the 404 loadSession already throws for a missing/foreign session', async () => {
    mockedLoadSession.mockRejectedValue(
      new AppError('Interview session not found', 404, 'NOT_FOUND')
    );

    await expect(getSessionSummary(SESSION_ID, USER_ID)).rejects.toMatchObject({
      statusCode: 404,
      code: 'NOT_FOUND',
    });
  });

  it('rejects with 409 when the session has not finished yet', async () => {
    mockedLoadSession.mockResolvedValue(baseSession({ status: 'active' }));

    await expect(getSessionSummary(SESSION_ID, USER_ID)).rejects.toMatchObject({
      statusCode: 409,
      code: 'SESSION_NOT_COMPLETED',
    });
    expect(mockedSummarizeSession).not.toHaveBeenCalled();
  });

  it('calls Gemini once, caches the result, and returns the full breakdown', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'Great work on Stack, review Recursion.',
      strengths: ['Stack'],
      weaknesses: ['Recursion'],
      recommendations: ['Redo the recursion exercises.'],
    });

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(mockedSummarizeSession).toHaveBeenCalledTimes(1);
    expect(mockedSummarizeSession).toHaveBeenCalledWith({
      concepts: [
        { conceptName: 'Stack', masteryScore: 0.85, verdicts: ['deep'] },
        { conceptName: 'Recursion', masteryScore: 0.4, verdicts: ['wrong'] },
      ],
      language: 'vi',
    });
    expect(result.summary).toEqual({
      text: 'Great work on Stack, review Recursion.',
      strengths: ['Stack'],
      weaknesses: ['Recursion'],
      recommendations: ['Redo the recursion exercises.'],
      generatedByAi: true,
      message: null,
    });
    expect(result.durationMinutes).toBe(12);
    expect(result.concepts).toEqual([
      {
        conceptId: CONCEPT_A,
        name: 'Stack',
        masteryScore: 0.85,
        turns: [{ turnIndex: 1, score: 0.85, verdict: 'deep' }],
      },
      {
        conceptId: CONCEPT_B,
        name: 'Recursion',
        masteryScore: 0.4,
        turns: [{ turnIndex: 1, score: 0.4, verdict: 'wrong' }],
      },
    ]);

    // Cached as JSON in the single summaryText column — see session-summary.service.ts for why.
    expect(mockedPrisma.interviewSession.update).toHaveBeenCalledWith({
      where: { id: SESSION_ID },
      data: {
        summaryText: JSON.stringify({
          summaryText: 'Great work on Stack, review Recursion.',
          strengths: ['Stack'],
          weaknesses: ['Recursion'],
          recommendations: ['Redo the recursion exercises.'],
        }),
      },
    });
  });

  it('reads from the cache on a second call and never calls Gemini again (R01)', async () => {
    const cached = JSON.stringify({
      summaryText: 'Cached report.',
      strengths: ['Stack'],
      weaknesses: ['Recursion'],
      recommendations: ['Redo recursion.'],
    });
    mockedLoadSession.mockResolvedValue(baseSession({ summaryText: cached }));

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(mockedSummarizeSession).not.toHaveBeenCalled();
    expect(mockedPrisma.interviewSession.update).not.toHaveBeenCalled();
    expect(result.summary).toEqual({
      text: 'Cached report.',
      strengths: ['Stack'],
      weaknesses: ['Recursion'],
      recommendations: ['Redo recursion.'],
      generatedByAi: true,
      message: null,
    });
  });

  it('falls back to a structured-only report when summarize_session fails (UC-14 E1)', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedSummarizeSession.mockRejectedValue(new AppError('down', 502, 'AI_UNAVAILABLE'));

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(result.summary).toEqual({
      text: null,
      strengths: [],
      weaknesses: [],
      recommendations: [],
      generatedByAi: false,
      message: 'Không thể tổng hợp nhận xét lúc này.',
    });
    // The score table is still real even though the AI text is not.
    expect(result.concepts).toHaveLength(2);
    expect(mockedPrisma.interviewSession.update).not.toHaveBeenCalled();
  });

  it('re-throws a non-AI error from summarize_session rather than masking it as unavailable', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedSummarizeSession.mockRejectedValue(new Error('unexpected bug'));

    await expect(getSessionSummary(SESSION_ID, USER_ID)).rejects.toThrow('unexpected bug');
  });

  it('never calls Gemini when no concept was ever graded (E1 ended the session immediately)', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedPrisma.interviewTurn.findMany.mockResolvedValue([]);

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(mockedSummarizeSession).not.toHaveBeenCalled();
    expect(result.summary.generatedByAi).toBe(false);
    expect(result.concepts.every((c) => c.turns.length === 0)).toBe(true);
  });

  it('skips a concept whose row was deleted since (re-analysis) without crashing', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedPrisma.concept.findMany.mockResolvedValue([
      { id: CONCEPT_A, name: 'Stack', masteryScore: 0.85 },
      // CONCEPT_B missing entirely.
    ]);
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'ok',
      strengths: [],
      weaknesses: [],
      recommendations: [],
    });

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(result.concepts.map((c) => c.conceptId)).toEqual([CONCEPT_A]);
  });

  it('assembles the traceback block from ReviewQueueItem, resolving the source concept name', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedPrisma.reviewQueueItem.findMany.mockResolvedValue([
      {
        conceptId: 'prereq-uuid',
        reason: 'traceback',
        depth: 1,
        status: 'pending',
        scheduledFor: TRACEBACK_DUE,
        sourceConceptId: CONCEPT_A,
        concept: { name: 'Giới hạn hàm số' },
      },
    ]);
    mockedPrisma.concept.findMany
      .mockResolvedValueOnce([
        { id: CONCEPT_A, name: 'Stack', masteryScore: 0.85 },
        { id: CONCEPT_B, name: 'Recursion', masteryScore: 0.4 },
      ])
      .mockResolvedValueOnce([{ id: CONCEPT_A, name: 'Stack' }]);
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'ok',
      strengths: [],
      weaknesses: [],
      recommendations: [],
    });

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(result.traceback).toEqual([
      {
        conceptId: 'prereq-uuid',
        name: 'Giới hạn hàm số',
        reason: 'traceback',
        depth: 1,
        sourceConceptName: 'Stack',
        status: 'pending',
        scheduledFor: TRACEBACK_DUE,
      },
    ]);
  });

  /**
   * #119 Gap 2: the query used to filter `reason: 'traceback'`, which dropped the
   * spaced-repetition schedule I7.2 writes for every finished concept. The three cases below
   * pin the widened read — both reasons, in the queue order the summary screen renders.
   */
  it('reads every review row of the session, not just the traceback ones', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'ok',
      strengths: [],
      weaknesses: [],
      recommendations: [],
    });

    await getSessionSummary(SESSION_ID, USER_ID);

    expect(mockedPrisma.reviewQueueItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { sourceSessionId: SESSION_ID } })
    );
  });

  it('puts traceback prerequisites ahead of the spaced-repetition schedule, each in its own order', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    // Deliberately shuffled: deep prerequisite, late review, shallow prerequisite, early review.
    mockedPrisma.reviewQueueItem.findMany.mockResolvedValue([
      reviewRow({ conceptId: 'prereq-deep', name: 'Đệ quy nền', reason: 'traceback', depth: 2 }),
      reviewRow({
        conceptId: CONCEPT_B,
        name: 'Recursion',
        reason: 'spaced_repetition',
        scheduledFor: new Date('2026-08-18T10:00:00.000Z'),
      }),
      reviewRow({
        conceptId: 'prereq-shallow',
        name: 'Giới hạn hàm số',
        reason: 'traceback',
        depth: 1,
      }),
      reviewRow({
        conceptId: CONCEPT_A,
        name: 'Stack',
        reason: 'spaced_repetition',
        scheduledFor: new Date('2026-08-06T10:00:00.000Z'),
      }),
    ]);
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'ok',
      strengths: [],
      weaknesses: [],
      recommendations: [],
    });

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(result.traceback.map((item) => [item.reason, item.name])).toEqual([
      ['traceback', 'Giới hạn hàm số'],
      ['traceback', 'Đệ quy nền'],
      ['spaced_repetition', 'Stack'],
      ['spaced_repetition', 'Recursion'],
    ]);
    // The dates the "Phiên kế tiếp" section counts days from must survive the read.
    expect(result.traceback.map((item) => item.scheduledFor)).toEqual([
      TRACEBACK_DUE,
      TRACEBACK_DUE,
      new Date('2026-08-06T10:00:00.000Z'),
      new Date('2026-08-18T10:00:00.000Z'),
    ]);
  });

  it('returns the spaced-repetition schedule for a session that triggered no traceback', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedPrisma.reviewQueueItem.findMany.mockResolvedValue([
      reviewRow({
        conceptId: CONCEPT_A,
        name: 'Stack',
        reason: 'spaced_repetition',
        scheduledFor: new Date('2026-08-16T10:00:00.000Z'),
      }),
    ]);
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'ok',
      strengths: [],
      weaknesses: [],
      recommendations: [],
    });

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    // The whole point of the widening: a student who did well used to get [] here.
    expect(result.traceback).toEqual([
      {
        conceptId: CONCEPT_A,
        name: 'Stack',
        reason: 'spaced_repetition',
        depth: null,
        sourceConceptName: null,
        status: 'pending',
        scheduledFor: new Date('2026-08-16T10:00:00.000Z'),
      },
    ]);
  });

  it('returns an empty schedule when the session queued nothing at all', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedPrisma.reviewQueueItem.findMany.mockResolvedValue([]);
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'ok',
      strengths: [],
      weaknesses: [],
      recommendations: [],
    });

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(result.traceback).toEqual([]);
    // No source-concept lookup to make, so only loadConceptSummaries' own query ran.
    expect(mockedPrisma.concept.findMany).toHaveBeenCalledTimes(1);
  });

  it('reports durationMinutes as 0 for the defensive case of a missing endedAt', async () => {
    mockedLoadSession.mockResolvedValue(baseSession({ endedAt: null }));
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'ok',
      strengths: [],
      weaknesses: [],
      recommendations: [],
    });

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(result.durationMinutes).toBe(0);
  });

  it('still returns the AI result when the cache write fails (best-effort, R01 quota)', async () => {
    mockedLoadSession.mockResolvedValue(baseSession());
    mockedSummarizeSession.mockResolvedValue({
      summary_text: 'Great work.',
      strengths: ['Stack'],
      weaknesses: ['Recursion'],
      recommendations: ['Practice more.'],
    });
    mockedPrisma.interviewSession.update.mockRejectedValue(new Error('DB connection lost'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await getSessionSummary(SESSION_ID, USER_ID);

    expect(result.summary).toEqual({
      text: 'Great work.',
      strengths: ['Stack'],
      weaknesses: ['Recursion'],
      recommendations: ['Practice more.'],
      generatedByAi: true,
      message: null,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      '[session-summary] failed to cache summary to DB:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

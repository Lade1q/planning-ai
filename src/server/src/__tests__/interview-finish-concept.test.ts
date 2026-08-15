import { getInterview } from '../services/interview.service';
import prisma from '../config/prisma';

/**
 * `finishConcept` closing a concept that got deprecated mid-session (#340 routing, `outcome:
 * 'skipped'`), reached through `getInterview` re-entering the state machine on an
 * already-graded final turn — no Gemini call happens on this path (`decideNextStep` ends the
 * concept before `askQuestion` would ever run), so `gemini.service` is mocked but never invoked.
 *
 * The one behaviour this issue's DoD requires here: a deprecated concept must not stall the
 * session. `currentConceptIdx` still advances and the session still completes, exactly as it
 * would for a concept that scored normally — `conceptCompleted` is simply absent for this one
 * (see the plan's scope decision: the FE result screen, issue #3, is what would ever show the
 * difference between "scored" and "skipped").
 */
jest.mock('../config/prisma', () => {
  const client: Record<string, unknown> = {
    interviewSession: { findUnique: jest.fn(), update: jest.fn() },
    interviewTurn: { findMany: jest.fn() },
    concept: { findFirst: jest.fn() },
    conceptCheckpoint: { count: jest.fn() },
    document: { findMany: jest.fn() },
  };
  client.$transaction = jest.fn((arg: unknown) =>
    typeof arg === 'function'
      ? (arg as (tx: unknown) => unknown)(client)
      : Promise.all(arg as Array<Promise<unknown>>)
  );
  return { __esModule: true, default: client };
});
jest.mock('../services/gemini.service', () => ({
  generateQuestion: jest.fn(),
  gradeAnswer: jest.fn(),
  getPlanMaterial: jest.fn(),
  uploadFile: jest.fn(),
}));

const mockedPrisma = prisma as unknown as {
  interviewSession: { findUnique: jest.Mock; update: jest.Mock };
  interviewTurn: { findMany: jest.Mock };
  concept: { findFirst: jest.Mock };
  conceptCheckpoint: { count: jest.Mock };
  document: { findMany: jest.Mock };
};

const USER_ID = 'user-uuid';
const SESSION_ID = 'session-uuid';
const PLAN_ID = 'plan-uuid';
/** The only concept of this session's queue — deprecated between analysis and this read. */
const CONCEPT_ID = 'concept-uuid';
const CONCEPT_NAME = 'Đệ quy';

const originalUseMockAi = process.env.USE_MOCK_AI;

interface FakeTurn {
  sessionId: string;
  conceptId: string;
  turnIndex: number;
  score: number | null;
  verdict: string | null;
  sourceDocumentId: string | null;
}

let sessionRow: {
  id: string;
  userId: string;
  planId: string;
  status: string;
  conceptQueue: string[];
  currentConceptIdx: number;
  maxTurnsPerConcept: number;
  fallbackMode: boolean;
  startedAt: Date;
  endedAt: Date | null;
  plan: { languageDetected: string | null };
};
let turns: FakeTurn[];
/** Whether the one concept in the plan is deprecated — the case this file exists to cover. */
let conceptDeprecated: boolean;
/** `C` for the concept — kept >= MIN_CHECKPOINTS_FOR_COVERAGE so the close routes to coverage. */
let checkpointCount: number;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.USE_MOCK_AI = 'false'; // evidenceIsRequested() must be true to reach the coverage grain
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  jest.spyOn(console, 'log').mockImplementation(() => undefined);

  turns = [
    {
      sessionId: SESSION_ID,
      conceptId: CONCEPT_ID,
      turnIndex: 1,
      score: 0.1,
      verdict: 'wrong',
      sourceDocumentId: null,
    },
  ];
  conceptDeprecated = true;
  checkpointCount = 4;
  sessionRow = {
    id: SESSION_ID,
    userId: USER_ID,
    planId: PLAN_ID,
    status: 'active',
    conceptQueue: [CONCEPT_ID],
    currentConceptIdx: 0,
    maxTurnsPerConcept: 3,
    fallbackMode: false,
    startedAt: new Date(2026, 7, 5, 21, 0),
    endedAt: null,
    plan: { languageDetected: 'vi' },
  };

  mockedPrisma.interviewSession.findUnique.mockImplementation(
    ({ where }: { where: { id: string } }) =>
      Promise.resolve(where.id === SESSION_ID ? { ...sessionRow } : null)
  );
  mockedPrisma.interviewSession.update.mockImplementation(
    ({ data }: { data: Partial<typeof sessionRow> }) => {
      Object.assign(sessionRow, data);
      return Promise.resolve({ ...sessionRow });
    }
  );
  mockedPrisma.interviewTurn.findMany.mockImplementation(
    ({ where }: { where: { sessionId: string; conceptId?: string } }) =>
      Promise.resolve(
        turns
          .filter((turn) => turn.sessionId === where.sessionId)
          .filter((turn) => !where.conceptId || turn.conceptId === where.conceptId)
          .map((turn) => ({ ...turn, concept: { name: CONCEPT_NAME } }))
      )
  );
  // Backs both `resolveCurrentConcept` ({id, name}) and `finalizeConceptCoverage`'s own read
  // ({status}) — the hand-rolled fake ignores `select` and returns every field either caller
  // might ask for, the same shortcut `interview-abandon.test.ts` / `concept-close.test.ts` take.
  mockedPrisma.concept.findFirst.mockImplementation(
    ({ where }: { where: { id: string; planId: string } }) =>
      Promise.resolve(
        where.id === CONCEPT_ID && where.planId === PLAN_ID
          ? {
              id: CONCEPT_ID,
              name: CONCEPT_NAME,
              planId: PLAN_ID,
              status: conceptDeprecated ? 'deprecated' : 'active',
            }
          : null
      )
  );
  mockedPrisma.conceptCheckpoint.count.mockImplementation(() => Promise.resolve(checkpointCount));
  mockedPrisma.document.findMany.mockResolvedValue([]);
});

afterEach(() => {
  jest.restoreAllMocks();
  process.env.USE_MOCK_AI = originalUseMockAi;
});

describe('getInterview — a concept deprecated mid-session (outcome: skipped)', () => {
  it('does not throw, and still ends the session instead of stalling it', async () => {
    await expect(getInterview(SESSION_ID, USER_ID)).resolves.toBeDefined();
  });

  it('still advances currentConceptIdx and completes the session', async () => {
    const result = await getInterview(SESSION_ID, USER_ID);

    expect(sessionRow.currentConceptIdx).toBe(1);
    expect(sessionRow.status).toBe('completed');
    expect(result.session.status).toBe('completed');
  });

  it('reports no completed-concept payload for the skipped concept', async () => {
    const result = await getInterview(SESSION_ID, USER_ID);

    expect(result.currentQuestion).toBeNull();
  });
});

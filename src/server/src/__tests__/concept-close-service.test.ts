import { closeConcept } from '../services/concept-close.service';
import { countConceptCheckpoints } from '../services/checkpoint.service';
import { finalizeConceptResult } from '../services/concept-result.service';
import { finalizeConceptCoverage } from '../services/concept-coverage.service';

/**
 * The routing decision between the turn grain and the coverage grain (#340's gap): both close
 * sites in `interview.service.ts` go through `closeConcept`, so this is the one place the
 * `C >= MIN_CHECKPOINTS_FOR_COVERAGE` predicate is exercised without needing a real DB (R05).
 *
 * `finalizeConceptResult` / `finalizeConceptCoverage` are mocked out entirely — their own
 * behaviour (score, schedule, traceback) is covered by `concept-close.test.ts` and
 * `concept-coverage-service.test.ts`. This file only asserts WHICH one gets called, and that the
 * turn-grain result is wrapped into the same `ConceptCloseResult` shape the coverage grain
 * returns natively.
 */
jest.mock('../services/checkpoint.service', () => ({
  countConceptCheckpoints: jest.fn(),
}));
jest.mock('../services/concept-result.service', () => ({
  finalizeConceptResult: jest.fn(),
}));
jest.mock('../services/concept-coverage.service', () => ({
  finalizeConceptCoverage: jest.fn(),
}));

const mockedCount = countConceptCheckpoints as jest.Mock;
const mockedFinalizeResult = finalizeConceptResult as jest.Mock;
const mockedFinalizeCoverage = finalizeConceptCoverage as jest.Mock;

const SESSION_ID = '11111111-1111-4111-8111-111111111111';
const CONCEPT_ID = '22222222-2222-4222-8222-222222222222';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('closeConcept — routing', () => {
  it('routes to the coverage grain once the checkpoint count meets N with evidence enabled', async () => {
    mockedCount.mockResolvedValue(4); // MIN_CHECKPOINTS_FOR_COVERAGE
    mockedFinalizeCoverage.mockResolvedValue({
      outcome: 'closed',
      conceptId: CONCEPT_ID,
      masteryScore: 0.67,
      tally: { committed: 4, resolved: 3, notDiscussed: 1, evCovered: 2, evContradicted: 1 },
      schedule: {
        reviewInDays: 10,
        scheduledFor: new Date('2026-08-25T00:00:00.000Z'),
        prerequisites: [],
        tracebackSkipReason: null,
      },
    });

    const result = await closeConcept({
      sessionId: SESSION_ID,
      conceptId: CONCEPT_ID,
      turnScores: [],
      evidenceEnabled: true,
    });

    expect(mockedFinalizeCoverage).toHaveBeenCalledWith({
      sessionId: SESSION_ID,
      conceptId: CONCEPT_ID,
    });
    expect(mockedFinalizeResult).not.toHaveBeenCalled();
    expect(result.outcome).toBe('closed');
  });

  it('stays on the turn grain below N, whatever evidence is enabled', async () => {
    mockedCount.mockResolvedValue(3); // MIN_CHECKPOINTS_FOR_COVERAGE - 1
    mockedFinalizeResult.mockResolvedValue({
      conceptId: CONCEPT_ID,
      masteryScore: 0.4,
      reviewInDays: 6,
      scheduledFor: new Date('2026-08-21T00:00:00.000Z'),
      prerequisites: [],
      tracebackSkipReason: null,
    });

    const result = await closeConcept({
      sessionId: SESSION_ID,
      conceptId: CONCEPT_ID,
      turnScores: [1.0, 0.0],
      evidenceEnabled: true,
    });

    expect(mockedFinalizeCoverage).not.toHaveBeenCalled();
    expect(mockedFinalizeResult).toHaveBeenCalledWith({
      sessionId: SESSION_ID,
      conceptId: CONCEPT_ID,
      turnScores: [1.0, 0.0],
    });
    // Wrapped into the coverage-shaped union: `tally: null` marks it as having none, `schedule`
    // nests what the turn grain returns flat — the exact mapping toConceptCompleted's caller relies on.
    expect(result).toEqual({
      outcome: 'closed',
      conceptId: CONCEPT_ID,
      masteryScore: 0.4,
      tally: null,
      schedule: {
        reviewInDays: 6,
        scheduledFor: new Date('2026-08-21T00:00:00.000Z'),
        prerequisites: [],
        tracebackSkipReason: null,
      },
    });
  });

  it('never nullifies mock mode: enough checkpoints but evidenceEnabled=false still uses the turn grain', async () => {
    // #346: mock mode writes no evidence, so C >= N alone would route a mock concept to
    // coverage and read resolved = 0 for every one of them.
    mockedCount.mockResolvedValue(10);
    mockedFinalizeResult.mockResolvedValue({
      conceptId: CONCEPT_ID,
      masteryScore: 1,
      reviewInDays: 14,
      scheduledFor: new Date('2026-08-29T00:00:00.000Z'),
      prerequisites: [],
      tracebackSkipReason: null,
    });

    await closeConcept({
      sessionId: SESSION_ID,
      conceptId: CONCEPT_ID,
      turnScores: [1.0],
      evidenceEnabled: false,
    });

    expect(mockedFinalizeCoverage).not.toHaveBeenCalled();
    expect(mockedFinalizeResult).toHaveBeenCalledTimes(1);
  });

  it('passes a skipped outcome through unchanged', async () => {
    mockedCount.mockResolvedValue(5);
    mockedFinalizeCoverage.mockResolvedValue({
      outcome: 'skipped',
      conceptId: CONCEPT_ID,
      reason: 'deprecated',
    });

    const result = await closeConcept({
      sessionId: SESSION_ID,
      conceptId: CONCEPT_ID,
      turnScores: [],
      evidenceEnabled: true,
    });

    expect(result).toEqual({ outcome: 'skipped', conceptId: CONCEPT_ID, reason: 'deprecated' });
  });
});

import { finalizeConceptCoverage } from '../services/concept-coverage.service';
import prisma from '../config/prisma';

jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: {
    conceptCheckpoint: { findMany: jest.fn(), count: jest.fn() },
    interviewEvidence: { findMany: jest.fn() },
    concept: { update: jest.fn() },
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const checkpointFindMany = () => mockedPrisma.conceptCheckpoint.findMany as jest.Mock;
const checkpointCount = () => mockedPrisma.conceptCheckpoint.count as jest.Mock;
const evidenceFindMany = () => mockedPrisma.interviewEvidence.findMany as jest.Mock;
const conceptUpdate = () => mockedPrisma.concept.update as jest.Mock;

const SESSION = '11111111-1111-4111-8111-111111111111';
const CONCEPT = '22222222-2222-4222-8222-222222222222';

/** Four committed checkpoints, in extraction order — the ruler as `listConceptCheckpoints` returns it. */
function ruler(count = 4) {
  return Array.from({ length: count }, (_, index) => ({
    id: `cp-${index + 1}`,
    text: `Điểm kiểm ${index + 1}`,
    orderIndex: index,
  }));
}

/** Deriving and storing a concept's score at close (#331). */
describe('finalizeConceptCoverage', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => warn.mockRestore());

  it('scores the concept from its own evidence and writes the result down', async () => {
    checkpointFindMany().mockResolvedValue(ruler());
    evidenceFindMany().mockResolvedValue([
      { checkpointId: 'cp-1', status: 'covered' },
      { checkpointId: 'cp-2', status: 'covered' },
      { checkpointId: 'cp-3', status: 'contradicted' },
    ]);

    const result = await finalizeConceptCoverage(SESSION, CONCEPT);

    // coverage 3/4 = 0.75 ≥ 0.7 → score is the share resolved correctly, 2/3.
    expect(result.masteryScore).toBe(0.67);
    expect(result.tally).toMatchObject({ committed: 4, resolved: 3, notDiscussed: 1 });

    // Evidence is read for THIS session and THIS concept — never a concept's evidence across
    // sessions, which would score the current session on what an earlier one proved.
    expect(evidenceFindMany()).toHaveBeenCalledWith(
      expect.objectContaining({ where: { sessionId: SESSION, conceptId: CONCEPT } })
    );

    expect(conceptUpdate()).toHaveBeenCalledTimes(1);
    const update = conceptUpdate().mock.calls[0][0];
    expect(update.where).toEqual({ id: CONCEPT });
    expect(update.data.masteryScore).toBe(0.67);
    expect(update.data.lastTestedAt).toBeInstanceOf(Date);
  });

  it('below the coverage floor it writes NOTHING — null must not erase a score already proven', async () => {
    checkpointFindMany().mockResolvedValue(ruler());
    evidenceFindMany().mockResolvedValue([
      { checkpointId: 'cp-1', status: 'covered' },
      { checkpointId: 'cp-2', status: 'covered' },
    ]);

    const result = await finalizeConceptCoverage(SESSION, CONCEPT);

    expect(result.masteryScore).toBeNull();
    expect(result.tally.notDiscussed).toBe(2);
    // Not "wrote null" and not "wrote 0": the stored score and lastTestedAt stay as they were,
    // and getting the concept back in front of the student is the review queue's job.
    expect(conceptUpdate()).not.toHaveBeenCalled();
  });

  it('C comes from the same read as the join target, not from a second count query', async () => {
    checkpointFindMany().mockResolvedValue(ruler(3));
    evidenceFindMany().mockResolvedValue([{ checkpointId: 'cp-1', status: 'covered' }]);

    const result = await finalizeConceptCoverage(SESSION, CONCEPT);

    expect(result.tally.committed).toBe(3);
    // A separate countConceptCheckpoints() is the same number from a different statement — a
    // re-analysis landing between the two would score the concept against a C its own checkpoint
    // set never had.
    expect(checkpointCount()).not.toHaveBeenCalled();
    expect(checkpointFindMany()).toHaveBeenCalledTimes(1);
  });

  it('warns when evidence points outside the current ruler, and keeps it out of the score', async () => {
    checkpointFindMany().mockResolvedValue(ruler(3));
    evidenceFindMany().mockResolvedValue([
      { checkpointId: 'cp-1', status: 'covered' },
      { checkpointId: 'cp-2', status: 'covered' },
      { checkpointId: 'cp-3', status: 'covered' },
      { checkpointId: 'cp-deleted', status: 'contradicted' },
    ]);

    const result = await finalizeConceptCoverage(SESSION, CONCEPT);

    // The stale row neither counts as coverage nor is charged: 3 of 3, not 3 of 4 or 4 of 3.
    expect(result.tally).toMatchObject({ committed: 3, evCovered: 3, evContradicted: 0 });
    expect(result.masteryScore).toBe(1);

    // The join drops it silently; this line is the only thing that says drift is happening.
    expect(warn).toHaveBeenCalledTimes(1);
    const message = warn.mock.calls[0][0] as string;
    expect(message).toContain(CONCEPT);
    expect(message).toContain('cp-deleted');
  });

  it('stays quiet when nothing drifted', async () => {
    checkpointFindMany().mockResolvedValue(ruler(2));
    evidenceFindMany().mockResolvedValue([{ checkpointId: 'cp-1', status: 'covered' }]);

    await finalizeConceptCoverage(SESSION, CONCEPT);

    expect(warn).not.toHaveBeenCalled();
  });

  it('a concept with no checkpoints is unassessable, not a crash and not a zero', async () => {
    checkpointFindMany().mockResolvedValue([]);
    evidenceFindMany().mockResolvedValue([]);

    const result = await finalizeConceptCoverage(SESSION, CONCEPT);

    expect(result.masteryScore).toBeNull();
    expect(result.tally.committed).toBe(0);
    expect(conceptUpdate()).not.toHaveBeenCalled();
  });
});

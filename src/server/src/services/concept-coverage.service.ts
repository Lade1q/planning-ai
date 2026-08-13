import prisma from '../config/prisma';
import { listConceptCheckpoints } from './checkpoint.service';
import { tallyConceptEvidence, type CoverageTally } from '../utils/evidence-tally';
import { coverageMasteryScore } from '../utils/mastery';

/**
 * Closing one concept of an Interview v2 session: read its evidence, derive its mastery score,
 * write it down (#331, §2.1/§2.3).
 *
 * The counterpart of `finalizeConceptResult` for the checkpoint-coverage grain. The AI never
 * emitted a score — it emitted evidence, one checkpoint at a time (#330) — so the score is
 * computed here, deterministically, out of what is stored. Everything downstream of the score
 * (`classifyMastery`, `reviewIntervalDays`, traceback) is untouched: it still receives a
 * `number | null` per concept.
 *
 * Scope note — this has NO caller yet, by design, the same boundary #330 drew. The trigger for
 * "the concept is finished" belongs to the voice conductor over the WS proxy, which does not
 * exist yet, and the text path keeps scoring from turns until the §7 cutover. What is built here
 * is the derivation and the write.
 */

export interface ConceptCoverageResult {
  conceptId: string;
  /**
   * What the concept scored, or `null` when too little of it was resolved to judge — "not
   * assessed", not a low score (§2.3). `null` is also exactly when nothing was written.
   */
  masteryScore: number | null;
  /** The counts the score came from, including how many checkpoints went unanswered. */
  tally: CoverageTally;
}

/**
 * Scores ONE concept of ONE session from its stored evidence and writes the result.
 *
 * Derived ONCE, here, and stored — the read paths (summary, engine, graph) read the stored
 * number and must not recompute this. A mastery score is a function of the ruler as it stood
 * when the concept was scored, and the ruler is not immutable: a re-analysis weeks later adds or
 * deletes checkpoints, so recomputing at read time would silently restate what an old session
 * scored. (The same class of bug the `sourceDocumentId` note warns about: the evidence is
 * immutable, the thing it is measured against is not.) The text path is immune to this because a
 * turn is immutable; this path is not, which is why the write happens here.
 *
 * The ruler and the evidence are read concurrently, and `C` is the size of the ruler that was
 * just read — not a second `countConceptCheckpoints` query. That is the same number, but taken
 * from the same statement as the id set the evidence is joined against, so the numerator and the
 * denominator cannot come from two different moments: a re-analysis landing between two reads
 * could otherwise score a concept against a `C` its own checkpoint set never had.
 *
 * A concept with no checkpoints scores `null` and writes nothing — coverage is undefined without
 * a ruler, and such a concept belongs on the text path anyway (the §2.4 guard, not this
 * function's job).
 */
export async function finalizeConceptCoverage(
  sessionId: string,
  conceptId: string
): Promise<ConceptCoverageResult> {
  const [checkpoints, evidence] = await Promise.all([
    listConceptCheckpoints(conceptId),
    prisma.interviewEvidence.findMany({
      where: { sessionId, conceptId },
      select: { checkpointId: true, status: true },
    }),
  ]);

  const tally = tallyConceptEvidence(
    evidence,
    checkpoints.map((checkpoint) => checkpoint.id)
  );

  // The only live signal that a `checkpointId` has drifted. The inner join is what keeps a stale
  // or fabricated row out of the score, and it does that silently — without this line, evidence
  // could stop counting for a whole plan and nothing would ever say so.
  if (tally.orphanedCheckpointIds.length > 0) {
    console.warn(
      `[coverage] session ${sessionId} concept ${conceptId}: ${tally.orphanedCheckpointIds.length} evidence row(s) reference checkpoints this concept no longer commits, not counted (${tally.orphanedCheckpointIds.join(', ')})`
    );
  }

  const masteryScore = coverageMasteryScore(tally.evCovered, tally.evContradicted, tally.committed);

  // `null` leaves the stored score alone rather than erasing it, matching `finalizeConceptResult`:
  // writing "not assessed" over a score an earlier session proved would be data loss, and
  // `lastTestedAt` would then date an assessment that produced nothing. Getting the concept back
  // in front of the student is the review queue's job — the caller's, not this function's.
  if (masteryScore !== null) {
    await prisma.concept.update({
      where: { id: conceptId },
      data: { masteryScore, lastTestedAt: new Date() },
    });
  }

  return { conceptId, masteryScore, tally };
}

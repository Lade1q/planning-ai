import prisma from '../config/prisma';
import { listConceptCheckpoints } from './checkpoint.service';
import { tallyConceptEvidence, type CoverageTally } from '../utils/evidence-tally';
import { coverageMasteryScore } from '../utils/mastery';

/**
 * Scoring one concept of an Interview v2 session: read its evidence, derive its mastery score,
 * write it down (#331, §2.1/§2.3).
 *
 * The AI never emitted a score — it emitted evidence, one checkpoint at a time (#330) — so the
 * score is computed here, deterministically, out of what is stored. Everything downstream of the
 * score (`classifyMastery`, `reviewIntervalDays`, traceback) is untouched: it still receives a
 * `number | null` per concept.
 *
 * Scope note — this has NO caller yet, by design, the same boundary #330 drew. The trigger for
 * "the concept is finished" belongs to the voice conductor over the WS proxy, which does not
 * exist yet, and the text path keeps scoring from turns until the §7 cutover.
 *
 * It scores and writes, and stops there. The rest of closing a concept — the spaced-repetition
 * row and traceback — lives inside `finalizeConceptResult` (`concept-result.service.ts`), from
 * where it computes `effectiveMastery` down through the `upsertReviewItem` calls for the
 * prerequisites, and has not been factored out for reuse (#340). Until it is, a concept scored
 * through here is not scheduled and does not trace back.
 *
 * ⚠️ Whoever wires that up: the three writes are gated DIFFERENTLY, and the difference is the
 * whole point of the `null` case.
 *   - the spaced-repetition row is written UNCONDITIONALLY, on the prior score when this session
 *     could not grade the concept — that is how an unassessed concept comes back at all;
 *   - the score write is conditional (`null` → left alone, below);
 *   - traceback is gated on THIS session's score, so `null` skips it (`not_graded`).
 * `if (masteryScore !== null) { schedule }` is therefore broken: it drops exactly the concept
 * §2.3 promises will return to the queue.
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
 * `C` is the size of the checkpoint set that was just read, NOT a second
 * `countConceptCheckpoints` query: the denominator and the id set the evidence is joined against
 * then come out of one statement, atomically, which is what makes `resolved <= committed`
 * structural instead of hopeful.
 *
 * The evidence is a second, independent statement, and deliberately not wrapped with the first.
 * Postgres reads here at READ COMMITTED, where every statement takes its own snapshot, so a
 * `$transaction` around the pair would buy exactly nothing — only REPEATABLE READ would put both
 * reads on one snapshot. What makes two statements safe enough is that neither side can be caught
 * mid-change: evidence within a session only ever appears or is rewritten in place (never
 * deleted), and a re-analysis commits a concept's whole checkpoint set inside one transaction
 * (`persistCheckpoints`, in `analysis.service.ts`), so no read can see half a ruler. The score is
 * then what the ruler in force when it was read says about every conclusion recorded up to the
 * moment the evidence was read.
 *
 * Residual, written down rather than papered over: the two reads are microseconds apart, and a
 * re-analysis that GROWS the ruler inside that window is scored against the smaller ruler that
 * was in force when it was read — which can clear the coverage floor that today's larger ruler
 * would not. Every input is real; the two are simply not read at one instant. Closing it means
 * REPEATABLE READ, not a plain `$transaction`, and this window is not worth an isolation level.
 *
 * That safety leans on a file this one does not import. If `persistCheckpoints` ever stops being
 * committed atomically, #331 breaks AT A DISTANCE: a partly written ruler reads as a small `C`,
 * a small `C` reads as high coverage, and a score gets written where the honest answer was
 * `null`.
 *
 * A concept with no checkpoints scores `null` and writes nothing — coverage is undefined without
 * a ruler, and such a concept belongs on the text path anyway (the §2.4 guard, not this
 * function's job).
 */
export async function scoreConceptFromEvidence(
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

  // The inner join keeps a stale or fabricated row out of the score, and it does that silently —
  // without this line, evidence could stop counting for a whole plan and nothing would say so.
  // It reports one direction only: rows that fell OUT of the ruler. A ruler that GROWS changes
  // what the next derivation says without warning about anything, which is correct — growth is a
  // legitimate re-analysis, not a fault, and a score already written is protected by being derived
  // once rather than by this line.
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

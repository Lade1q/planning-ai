import { countConceptCheckpoints } from './checkpoint.service';
import { finalizeConceptResult } from './concept-result.service';
import { finalizeConceptCoverage, type ConceptCloseResult } from './concept-coverage.service';
import { shouldUseCoverageGrain } from '../utils/mastery';

/**
 * The one place that decides which grain closes a concept — turn-weighted average or
 * checkpoint-coverage — so both close sites in `interview.service.ts` (finishing normally, and
 * abandoning mid-concept) route through the same predicate instead of each carrying their own
 * copy of the `C >= N` check.
 *
 * `evidenceEnabled` is passed in rather than read from `process.env` here: this file has no
 * business knowing about mock mode, and a caller that already computed the flag (`interview
 * .service.ts`'s `evidenceIsRequested()`) should not have it re-derived a second way.
 */
export interface CloseConceptInput {
  sessionId: string;
  conceptId: string;
  /** Scores of the turns that were graded, in turn order. Only used on the turn grain. */
  turnScores: number[];
  evidenceEnabled: boolean;
}

/**
 * Closes one concept, routing to `finalizeConceptCoverage` when the concept has enough
 * checkpoints to judge a stall honestly (`shouldUseCoverageGrain`), and to `finalizeConceptResult`
 * otherwise. Always returns the coverage-shaped `ConceptCloseResult` union — the turn-grain result
 * is wrapped into it (`tally: null`, `schedule` nested) so callers handle one shape regardless of
 * which grain actually ran.
 */
export async function closeConcept(input: CloseConceptInput): Promise<ConceptCloseResult> {
  const { sessionId, conceptId, turnScores, evidenceEnabled } = input;
  const checkpointCount = await countConceptCheckpoints(conceptId);

  if (shouldUseCoverageGrain(checkpointCount, evidenceEnabled)) {
    return finalizeConceptCoverage({ sessionId, conceptId });
  }

  const result = await finalizeConceptResult({ sessionId, conceptId, turnScores });

  return {
    outcome: 'closed',
    conceptId: result.conceptId,
    masteryScore: result.masteryScore,
    tally: null,
    schedule: {
      reviewInDays: result.reviewInDays,
      scheduledFor: result.scheduledFor,
      prerequisites: result.prerequisites,
      tracebackSkipReason: result.tracebackSkipReason,
    },
  };
}

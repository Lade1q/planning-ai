import prisma from '../config/prisma';

/**
 * Reading back the checkpoints a concept committed at analysis time (#329).
 *
 * Writing them is `analysis.service.ts`'s job, inside the extraction transaction — there is no
 * write path here on purpose: a checkpoint list may only be produced by `extract_concepts`
 * (INV-1), so an interview must be able to READ the ruler and never to change it.
 */

export interface ConceptCheckpointRow {
  id: string;
  text: string;
  orderIndex: number;
}

/**
 * The committed checkpoints of one concept, in extraction order — what an examiner is allowed to
 * record evidence against, and nothing beyond it.
 *
 * An empty array means the concept has no ruler (`C = 0`); the §2.4 guard routes it to the text
 * path rather than treating it as an error.
 */
export async function listConceptCheckpoints(conceptId: string): Promise<ConceptCheckpointRow[]> {
  return prisma.conceptCheckpoint.findMany({
    where: { conceptId },
    select: { id: true, text: true, orderIndex: true },
    orderBy: { orderIndex: 'asc' },
  });
}

/**
 * `C` for one concept — the `committed` argument of `coverageMasteryScore` (`utils/mastery.ts`).
 *
 * Deliberately a COUNT OF STORED ROWS, read at the moment it is scored: never a number the model
 * reports, and never a length carried over from extraction time. Either of those could put a
 * stale or AI-chosen denominator under a mastery score, which is the whole thing INV-1 exists to
 * prevent. `0` is a valid answer, not a missing one.
 */
export async function countConceptCheckpoints(conceptId: string): Promise<number> {
  return prisma.conceptCheckpoint.count({ where: { conceptId } });
}

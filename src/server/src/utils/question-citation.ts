import type { DocumentKind, TurnSource } from '@prisma/client';
import type { QuestionSourceResponse } from '../types/interview.types';

/**
 * Which document/page an interview question gets to cite (C5), decided without touching the
 * database so the rule is provable on its own (R05).
 *
 * The anchors themselves are not computed here — `concept_sources` was already written by
 * `buildConceptSourceRows` during analysis. This module only picks *which* of a concept's
 * anchors a question shows, and when it must show none at all.
 */

/** One `concept_sources` row as the interview query reads it — deliberately without `excerpt`. */
export interface QuestionCitationRow {
  conceptId: string;
  pageFrom: number | null;
  pageTo: number | null;
  document: { id: string; filename: string; kind: DocumentKind };
}

/**
 * Indexes a batch of anchors by concept, keeping the first row of each. Callers order the rows
 * by `createdAt` ascending, so a concept anchored in several documents cites the same one the
 * DB-06 detail panel lists first (`getConceptDetail`) — one concept, one citation, everywhere.
 */
export function buildCitationMap(rows: QuestionCitationRow[]): Map<string, QuestionSourceResponse> {
  const byConcept = new Map<string, QuestionSourceResponse>();

  for (const row of rows) {
    if (byConcept.has(row.conceptId)) continue;
    byConcept.set(row.conceptId, {
      documentId: row.document.id,
      filename: row.document.filename,
      kind: row.document.kind,
      pageFrom: row.pageFrom,
      pageTo: row.pageTo,
    });
  }

  return byConcept;
}

/**
 * The citation for one turn, or `null` when there is nothing honest to show.
 *
 * Two ways to get `null`, and neither is an error:
 *
 * 1. The concept has no anchor — it was added by hand (#172), or `extract_concepts` returned
 *    neither a page nor an excerpt for it. The client renders no citation block.
 * 2. The question came from `question_cache` (AE-05 flashcard fallback). An `InterviewTurn`
 *    does not record *which* cache row it was served from, and the cache survives a document
 *    change (#216) — so the concept's current anchor may point at a document the cached
 *    question was never generated from. Citing it would be a fabricated citation, exactly what
 *    C5 forbids. Once #216 clears the cache on re-analysis this arm can be dropped, and cached
 *    questions become citable too.
 */
export function pickCitation(
  citations: Map<string, QuestionSourceResponse>,
  conceptId: string,
  turnSource: TurnSource
): QuestionSourceResponse | null {
  if (turnSource === 'cache_fallback') return null;
  return citations.get(conceptId) ?? null;
}

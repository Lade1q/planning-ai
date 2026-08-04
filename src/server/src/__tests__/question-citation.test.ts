import {
  buildCitationMap,
  pickCitation,
  type QuestionCitationRow,
} from '../utils/question-citation';

/**
 * Unit tests for the C5 source anchor an interview question is allowed to show (#239).
 * Pure functions, no DB and no AI key: deciding when a citation must be withheld is
 * deterministic software logic, so it has to be provable on its own (R05).
 */
const PDF = { id: 'doc-pdf', filename: 'giai-tich-1.pdf', kind: 'pdf' as const };
const NOTES = { id: 'doc-notes', filename: 'ghi-chu.txt', kind: 'text' as const };

function row(overrides: Partial<QuestionCitationRow> = {}): QuestionCitationRow {
  return { conceptId: 'c-stack', pageFrom: 4, pageTo: 4, document: PDF, ...overrides };
}

describe('buildCitationMap', () => {
  it('maps a concept to its document and page span', () => {
    const map = buildCitationMap([row({ pageFrom: 4, pageTo: 6 })]);

    expect(map.get('c-stack')).toEqual({
      documentId: 'doc-pdf',
      filename: 'giai-tich-1.pdf',
      kind: 'pdf',
      pageFrom: 4,
      pageTo: 6,
    });
  });

  it('keeps a null page span for material that has no pages', () => {
    const map = buildCitationMap([row({ pageFrom: null, pageTo: null, document: NOTES })]);

    expect(map.get('c-stack')).toMatchObject({
      filename: 'ghi-chu.txt',
      pageFrom: null,
      pageTo: null,
    });
  });

  it('keeps the first anchor when a concept is anchored in several documents', () => {
    // Caller orders by createdAt asc, so "first" is the same document getConceptDetail lists first.
    const map = buildCitationMap([
      row({ document: PDF, pageFrom: 4, pageTo: 4 }),
      row({ document: NOTES, pageFrom: null, pageTo: null }),
    ]);

    expect(map.size).toBe(1);
    expect(map.get('c-stack')).toMatchObject({ documentId: 'doc-pdf', pageFrom: 4 });
  });

  it('indexes several concepts independently', () => {
    const map = buildCitationMap([row(), row({ conceptId: 'c-queue', document: NOTES })]);

    expect(map.get('c-stack')?.documentId).toBe('doc-pdf');
    expect(map.get('c-queue')?.documentId).toBe('doc-notes');
  });
});

describe('pickCitation', () => {
  const citations = buildCitationMap([row()]);

  it('returns the concept anchor for an AI-generated question', () => {
    expect(pickCitation(citations, 'c-stack', 'ai')).toMatchObject({ documentId: 'doc-pdf' });
  });

  it('returns null for a concept with no anchor — a manual concept is not an error', () => {
    expect(pickCitation(citations, 'c-manual', 'ai')).toBeNull();
  });

  it('returns null for a cached question even when the concept is anchored', () => {
    // The turn does not record which cache row it came from, and the cache outlives a document
    // change (#216) — citing the concept's current anchor would be a fabricated citation (C5).
    expect(pickCitation(citations, 'c-stack', 'cache_fallback')).toBeNull();
  });
});

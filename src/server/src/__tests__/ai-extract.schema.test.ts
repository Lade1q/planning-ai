import {
  CHECKPOINT_MAX_LENGTH,
  aiExtractJsonSchema,
  aiExtractResponseSchema,
} from '../schemas/ai-extract.schema';
import { normalizeCheckpoints } from '../utils/checkpoint';

/**
 * The `checkpoints` half of the `extract_concepts` contract (#329).
 *
 * What is being pinned is the DEGRADATION, not the happy path: this schema parses the output of a
 * model, and spike S0 measured that a declared constraint does not bind one. So the questions are
 * what a missing field costs, what a single bad entry costs, and whether either can take down an
 * extraction that is otherwise fine.
 */

/** Only the corner of the generated JSON Schema this test reads. */
interface JsonSchemaShape {
  properties: {
    concepts: { items: { required: string[]; properties: Record<string, unknown> } };
  };
}

const CONCEPT = {
  name: 'Subnet mask',
  difficulty: 3,
  source_page: 4,
  source_excerpt: 'A subnet mask splits an address into a network part and a host part.',
};

function parseCheckpoints(raw: unknown): string[] {
  const result = aiExtractResponseSchema.safeParse({
    concepts: [{ ...CONCEPT, checkpoints: raw }],
    edges: [],
    language_detected: 'vi',
  });
  if (!result.success) {
    throw new Error(`extraction rejected: ${result.error.issues[0]?.message}`);
  }
  return result.data.concepts[0]?.checkpoints ?? [];
}

describe('conceptExtractSchema — checkpoints', () => {
  it('keeps a well-formed list as given', () => {
    expect(parseCheckpoints(['Nêu được định nghĩa', 'Tính số host của một mạng'])).toEqual([
      'Nêu được định nghĩa',
      'Tính số host của một mạng',
    ]);
  });

  it('degrades a missing, null or non-array field to an empty list, never a failed extraction', () => {
    const result = aiExtractResponseSchema.safeParse({
      concepts: [CONCEPT], // no `checkpoints` key at all
      edges: [],
      language_detected: 'vi',
    });

    expect(result.success).toBe(true);
    expect(result.data?.concepts[0]?.checkpoints).toEqual([]);
    expect(parseCheckpoints(null)).toEqual([]);
    expect(parseCheckpoints('Nêu được định nghĩa, tính số host')).toEqual([]);
  });

  it('costs one entry, not the list, when a single checkpoint is unusable', () => {
    // Over-long / wrong-typed entries are caught to '' here and dropped by normalizeCheckpoints —
    // the two steps are separate so that a bad neighbour cannot erase good checkpoints.
    const parsed = parseCheckpoints([
      'Nêu được định nghĩa',
      'x'.repeat(CHECKPOINT_MAX_LENGTH + 1),
      42,
      'Tính số host của một mạng',
    ]);

    expect(parsed).toEqual(['Nêu được định nghĩa', '', '', 'Tính số host của một mạng']);
    expect(normalizeCheckpoints(parsed)).toEqual([
      'Nêu được định nghĩa',
      'Tính số host của một mạng',
    ]);
  });

  it('asks the model for checkpoints as a required, bounded field', () => {
    // The JSON schema is what Gemini is actually held to (C4: fixed schema). If `checkpoints`
    // stopped being required, a model would simply omit it and every concept would come back
    // with C = 0 — silently unassessable rather than visibly broken.
    const item = (aiExtractJsonSchema as unknown as JsonSchemaShape).properties.concepts.items;

    expect(item.required).toContain('checkpoints');
    expect(item.properties.checkpoints).toMatchObject({
      type: 'array',
      items: { type: 'string', maxLength: CHECKPOINT_MAX_LENGTH },
    });
  });
});

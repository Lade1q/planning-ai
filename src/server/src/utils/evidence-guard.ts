/**
 * Deterministic backstop for the evidence the AI examiner emits per checkpoint, run over
 * EVERY fire before the coverage formula (`coverageMasteryScore`, `mastery.ts`) counts it.
 *
 * Spike S0 (11/08) proved LIVE on Vertex native-audio that a declared constraint does not bind
 * the model on the Live async path — neither the schema nor the prompt:
 *   - INV-2 is not enforceable by prompt: the model probed correctly ("do you remember to
 *     subtract the two special addresses?"), heard "I don't remember, not sure", and still
 *     fired `contradicted`. An unresolved answer got punished as a misconception.
 *   - the enum is not reliable on async lag: under WHEN_IDLE the model emitted `status:"Running"`
 *     — outside the declared `{covered, contradicted}` enum — treating the tool like a job with
 *     a lifecycle. (SILENT kept the enum in that run, but n=1 is not a guarantee.)
 *
 * So the safety moves from AI-schema/prompt-trust to code here. Pure — no Prisma, no Gemini, no
 * clock — so it stays provable from fixtures with the database and API key switched off (R05).
 *
 * ONE-DIRECTIONAL guarantee (the rubric argument): this guard can only ever err on the side of
 * NOT punishing — downgrading a genuine `contradicted` to `not_discussed` loses one misconception,
 * which is the direction INV-2 allows ("better to miss one than punish an unfinished answer"). It
 * never turns `not_discussed` into a penalty and never upgrades a status. See the property test.
 *
 * Boundary: this guards against punishing-the-uncertain (INV-2) and enum garbage. It does NOT
 * police status fidelity of the covered↔contradicted kind on a CONFIDENT answer — that is grain
 * quality, measured separately at S1 with fixture transcripts.
 */

/** The only two statuses the coverage formula can consume. Anything else is dropped. */
export type EvidenceStatus = 'covered' | 'contradicted';

const IN_ENUM: ReadonlySet<string> = new Set<EvidenceStatus>(['covered', 'contradicted']);

/**
 * Lower-case + strip Vietnamese diacritics (and đ→d) so markers match regardless of accents.
 * Combining marks (U+0300–U+036F, left by NFD decomposition) are filtered by code point rather
 * than a regex holding literal combining characters, which source tooling can mangle.
 */
function normalize(text: string): string {
  const decomposed = text.toLowerCase().normalize('NFD');
  let out = '';
  for (const ch of decomposed) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x300 && code <= 0x36f) continue; // combining diacritical mark
    out += ch === 'đ' ? 'd' : ch;
  }
  return out;
}

/**
 * Uncertainty markers, matched as PHRASES (never bare stems) on the normalized quote. A stem
 * like "chắc" would swallow the assertion "chắc chắn"; the list stays phrase-level so
 * "chắc chắn" / "nhớ rõ" / "biết rõ" / "rõ ràng" never trigger a downgrade. Every marker added
 * here must come with a fixture test — see `evidence-guard.test.ts`.
 */
const UNCERTAINTY_MARKERS: readonly string[] = [
  'không nhớ',
  'không chắc',
  'không biết',
  'không rõ',
  'không nắm',
  'quên rồi',
  'quên mất',
  'tôi quên',
  'hình như',
  'chắc là',
  'chắc gì',
  'đại khái',
  'gì đó',
  'mơ hồ',
  'lơ mơ',
  'hên xui',
  'đoán đại',
  'chịu, không',
].map(normalize);

/** What the AI actually emitted for one checkpoint — `status` may be outside the enum. */
export interface RawEvidence {
  status: string;
  quote?: string | null;
}

/**
 * The outcome of sanitizing one fire. Only `kept` feeds the coverage denominator; `downgraded`
 * and `dropped` both mean "no evidence for this checkpoint" for scoring, but are distinguished
 * so an audit can count enum leakage (`dropped`) apart from uncertainty downgrades.
 */
export type SanitizedEvidence =
  | { kind: 'kept'; status: EvidenceStatus }
  | { kind: 'downgraded' } // uncertain quote → not_discussed (INV-2)
  | { kind: 'dropped' }; //   status outside the enum → treat as never fired

/**
 * (a) status outside `{covered, contradicted}` → DROP (garbage, e.g. "Running").
 * (b) otherwise, quote carrying an uncertainty marker → downgrade to `not_discussed`, regardless
 *     of whether the model claimed covered or contradicted.
 * (c) otherwise → keep.
 *
 * (a) runs before (b): a `Running` fire is dropped regardless of its quote. Composes with the
 * `(sessionId, conceptId, checkpointId)` upsert — a dropped `Running` leaves the row untouched,
 * and a later real `covered` still lands on the right cell.
 */
export function sanitizeEvidence(fire: RawEvidence): SanitizedEvidence {
  if (!IN_ENUM.has(fire.status)) {
    return { kind: 'dropped' };
  }
  const quote = normalize(fire.quote ?? '');
  if (UNCERTAINTY_MARKERS.some((marker) => quote.includes(marker))) {
    return { kind: 'downgraded' };
  }
  return { kind: 'kept', status: fire.status as EvidenceStatus };
}

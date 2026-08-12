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
 * The rubric argument, stated precisely. At the STATUS level the guard is one-directional: it
 * never upgrades a status (a fire is only ever kept as-is, downgraded, or dropped) and it never
 * manufactures a penalty out of `not_discussed`. What it does NOT promise is that a fire can only
 * move a score UP: downgrading a `covered` (a marker in its quote, §2.5) pulls that checkpoint out
 * of BOTH the numerator and denominator of `coverageMasteryScore`, so a marker FALSE POSITIVE can
 * lower a correct answer's score — even flip its band and trigger traceback. Marker precision is
 * therefore load-bearing, not cosmetic: the matcher runs on ACCENTED text (spike transcripts come
 * back fully accented) and matches whole marker phrases, so "không nhỏ" (≥) is not read as
 * "không nhớ" (I don't remember) and "chắc là" (maybe) is not read inside "chắc lắm" (definitely).
 *
 * Boundary: this guards against punishing-the-uncertain (INV-2) and enum garbage. It does NOT
 * police status fidelity of the covered↔contradicted kind on a CONFIDENT answer — that is grain
 * quality, measured separately at S1 with fixture transcripts.
 */

/** The only two statuses the coverage formula can consume. Anything else is dropped. */
export type EvidenceStatus = 'covered' | 'contradicted';

const IN_ENUM: ReadonlySet<string> = new Set<EvidenceStatus>(['covered', 'contradicted']);

/** Narrows a raw status string to the enum without a cast at the call site. */
function isEvidenceStatus(status: string): status is EvidenceStatus {
  return IN_ENUM.has(status);
}

/**
 * Lower-case and normalise to NFC — but KEEP the diacritics. Stripping them (an earlier version
 * did) collapses distinct words onto each other: "không nhỏ" (not smaller / ≥) becomes the marker
 * "không nhớ" (I don't remember), so a confident, correct subnet answer would be downgraded. Spike
 * S0 transcripts (inputTranscription, p3-evidence) come back fully accented, so there is no
 * un-accented input to be robust to here, and matching accented text is what keeps the marker
 * phrases apart from their confident look-alikes ("chắc là" vs "chắc lắm"). NFC so a precomposed
 * marker and a decomposed quote (or vice versa) still compare equal.
 */
function normalize(text: string): string {
  return text.toLowerCase().normalize('NFC');
}

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Uncertainty markers, matched as whole PHRASES on the normalized quote — never a bare stem, and
 * never a substring inside a longer word. Each compiles to a regex fenced by Unicode letter
 * boundaries (`\p{L}`), so "chắc là" (maybe) cannot fire inside "chắc lắm" (definitely) and the
 * two-token markers keep the confident phrases "chắc chắn" / "nhớ rõ" / "biết rõ" / "rõ ràng"
 * clear of a downgrade — by the mechanism, not by luck. Matching is accented (see `normalize`).
 * Every marker added here must come with a fixture test — see `evidence-guard.test.ts`.
 */
const UNCERTAINTY_MARKERS: readonly RegExp[] = [
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
].map((phrase) => new RegExp(`(?<!\\p{L})${escapeRegExp(normalize(phrase))}(?!\\p{L})`, 'u'));

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
  | { kind: 'downgraded' } // uncertain / unverifiable → not_discussed (INV-2)
  | { kind: 'dropped' }; //   status outside the enum → treat as never fired

/**
 * (a) status outside `{covered, contradicted}` → DROP (garbage, e.g. "Running"). The status is
 *     trimmed and case-folded first, because the same spike that produced `Running` shows the
 *     model reshaping the field — a legitimate `Covered` / `contradicted ` is rescued, while real
 *     garbage is still dropped.
 * (b) quote carrying an uncertainty marker → downgrade to `not_discussed`, whether the model
 *     claimed covered or contradicted.
 * (c) a `contradicted` with no quote to inspect → downgrade: an unverifiable misconception is a
 *     penalty with nothing behind it, and one-directional safety errs toward not punishing. A
 *     `covered` with no quote is the generous direction (over-credit, never a penalty) → kept.
 * (d) otherwise → keep.
 *
 * (a) runs before the rest: a `Running` fire is dropped regardless of its quote. Composes with
 * the `(sessionId, conceptId, checkpointId)` upsert — a dropped `Running` leaves the row
 * untouched, and a later real `covered` still lands on the right cell.
 */
export function sanitizeEvidence(fire: RawEvidence): SanitizedEvidence {
  const status = fire.status.trim().toLowerCase();
  if (!isEvidenceStatus(status)) {
    return { kind: 'dropped' };
  }
  const quote = normalize(fire.quote ?? '');
  if (UNCERTAINTY_MARKERS.some((marker) => marker.test(quote))) {
    return { kind: 'downgraded' };
  }
  if (status === 'contradicted' && quote.trim() === '') {
    return { kind: 'downgraded' };
  }
  return { kind: 'kept', status };
}

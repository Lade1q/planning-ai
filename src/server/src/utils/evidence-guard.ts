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
 * move a score UP: downgrading a `covered` (a marker in its quote) pulls that checkpoint out of
 * BOTH the numerator and denominator of `coverageMasteryScore`, so a marker false positive can
 * lower a correct answer's score — even flip its band and trigger traceback.
 *
 * Marker precision is therefore load-bearing, and it is ASYMMETRIC because the two failure
 * directions are not equal:
 *   - a `contradicted` fire is the dangerous one — a MISSED uncertainty marker leaves a penalty
 *     standing on an unresolved answer (INV-2 violated). So it is matched leniently, on
 *     diacritic-STRIPPED text, to also catch an un-accented "khong nho" typed on the text path
 *     (§2.1 fallback); a false positive here only ever downgrades a `contradicted`, which never
 *     manufactures a penalty.
 *   - a `covered` fire is matched strictly, on ACCENTED text, so a confident "không nhỏ" (≥) is
 *     never taken for the marker "không nhớ" (I don't remember). A false positive here would cost
 *     a correct answer its credit; a false negative merely over-credits (the generous direction).
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
 * Lower-case + NFC, keeping the diacritics. Vietnamese diacritics are semantic — "nhớ" (remember)
 * and "nhỏ" (small) are different words — so `covered` fires are matched on this accented form to
 * keep the marker phrases apart from their confident look-alikes. NFC so a precomposed marker and
 * a decomposed quote (or vice versa) still compare equal.
 */
function normalizeAccented(text: string): string {
  return text.toLowerCase().normalize('NFC');
}

/**
 * Lower-case + strip Vietnamese diacritics (and đ→d). Used only for `contradicted` fires, where a
 * lenient match is the safe direction: it also catches an un-accented "khong nho" a student types
 * on the text fallback, and any false positive it causes just downgrades a `contradicted` (never a
 * penalty). Combining marks (U+0300–U+036F, left by NFD) are filtered by code point rather than a
 * regex holding literal combining characters, which source tooling can mangle.
 */
function normalizeStripped(text: string): string {
  const decomposed = text.toLowerCase().normalize('NFD');
  let out = '';
  for (const ch of decomposed) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x300 && code <= 0x36f) continue; // combining diacritical mark
    out += ch === 'đ' ? 'd' : ch;
  }
  return out;
}

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Fence a normalized marker with Unicode letter boundaries so it matches a whole phrase, not a
 *  substring inside a longer word ("chắc là" must not fire inside "chắc lắm"). No `g` flag, so
 *  `.test()` is stateless (no `lastIndex` carry-over). */
function compileMarker(normalized: string): RegExp {
  return new RegExp(`(?<!\\p{L})${escapeRegExp(normalized)}(?!\\p{L})`, 'u');
}

/**
 * Uncertainty markers, matched as whole PHRASES — never a bare stem (a stem like "chắc" would
 * swallow the assertion "chắc chắn"), never a substring inside a longer word. The two-token forms
 * keep the confident phrases "chắc chắn" / "nhớ rõ" / "biết rõ" / "rõ ràng" clear of a downgrade.
 * First-person forms carry the pronoun a student uses with a teacher ("em"/"mình"/"con"), not
 * just "tôi". Every marker here must come with a fixture test — see `evidence-guard.test.ts`.
 */
const MARKER_PHRASES: readonly string[] = [
  'không nhớ',
  'không chắc',
  'không biết',
  'không rõ',
  'không nắm',
  'quên rồi',
  'quên mất',
  'tôi quên',
  'em quên',
  'mình quên',
  'con quên',
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
];

/** Strict, accented markers — for `covered` fires. */
const ACCENTED_MARKERS: readonly RegExp[] = MARKER_PHRASES.map((phrase) =>
  compileMarker(normalizeAccented(phrase))
);

/** Lenient, diacritic-stripped markers — for `contradicted` fires. */
const STRIPPED_MARKERS: readonly RegExp[] = MARKER_PHRASES.map((phrase) =>
  compileMarker(normalizeStripped(phrase))
);

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
 * (b) a `covered` whose quote carries an ACCENTED uncertainty marker → downgrade (strict, so a
 *     confident "không nhỏ" keeps its credit). Otherwise keep.
 * (c) a `contradicted` with no quote to inspect, or whose STRIPPED quote carries an uncertainty
 *     marker → downgrade. An unverifiable or uncertain misconception is a penalty with nothing
 *     behind it; downgrading it is the not-punishing direction, which for a `contradicted` never
 *     manufactures a penalty. Otherwise keep.
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
  const raw = fire.quote ?? '';

  if (status === 'covered') {
    const accented = normalizeAccented(raw);
    return ACCENTED_MARKERS.some((marker) => marker.test(accented))
      ? { kind: 'downgraded' }
      : { kind: 'kept', status };
  }

  // status === 'contradicted'
  const stripped = normalizeStripped(raw);
  if (stripped.trim() === '' || STRIPPED_MARKERS.some((marker) => marker.test(stripped))) {
    return { kind: 'downgraded' };
  }
  return { kind: 'kept', status };
}

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
 *   - a `covered` fire is matched strictly, on ACCENTED text, so a confident "không nhỏ" (≥) is
 *     never taken for the marker "không nhớ" (I don't remember). A false positive here would cost
 *     a correct answer its credit; a false negative merely over-credits (the generous direction).
 *   - a `contradicted` fire is the dangerous one — a MISSED uncertainty marker leaves a penalty
 *     standing on an unresolved answer (INV-2 violated). It is matched on accented markers, PLUS a
 *     lenient diacritic-STRIPPED pass — but only when the quote is ITSELF un-accented, the
 *     text-fallback population where a student typed "khong nho" without diacritics (§2.1). The
 *     lenient pass is gated by INPUT, not status, for a reason: a false positive on it does not
 *     manufacture a *penalty*, but it is NOT free — downgrading a `contradicted` drops it from the
 *     coverage denominator while the covered numerator stays, so the score moves UP (it can reach
 *     1.0, flip a band, switch traceback off — the "2/4 → 1.0" that §2.3's floor exists to stop,
 *     by another door). Fencing the lenient pass to un-accented input keeps a genuine misconception
 *     on the accented voice path from ever reaching it, so it keeps its slot in the denominator.
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
 *
 * Known residual on the strict (covered) path: a marker that is a genuine prefix of a confident
 * idiom still fires — e.g. "không biết" inside "không biết bao nhiêu" (countless). Word boundaries
 * do not cut it (the idiom continues past a space) and accents do not (same letters), so it would
 * downgrade a confident answer. Low frequency in exam answers, where a covered claim states a
 * number rather than the idiom — tune this lexicon against real transcripts when the pipeline is
 * wired (②) rather than growing idiom exclusions here on invented sentences.
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

/** Strict, accented markers — the `covered` path, and the primary pass on `contradicted`. */
const ACCENTED_MARKERS: readonly RegExp[] = MARKER_PHRASES.map((phrase) =>
  compileMarker(normalizeAccented(phrase))
);

/** Lenient, diacritic-stripped markers — the fallback pass on a `contradicted` whose quote is
 *  itself un-accented (text fallback). */
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
 * (a) status outside `{covered, contradicted}` → DROP (garbage, e.g. "Running"). Trim + case-fold
 *     first as cheap defence: the spike proved the model can leave the enum (`Running`), so
 *     rescuing a case/space variant of a real status (`Covered` / `contradicted `) is prudent —
 *     though the observed run only produced lowercase in-enum values plus `Running`, so this is
 *     precaution, not a fix for a case that was actually seen.
 * (b) a `covered` whose quote carries an ACCENTED uncertainty marker → downgrade (strict, so a
 *     confident "không nhỏ" keeps its credit). Otherwise keep.
 * (c) a `contradicted` with no quote to inspect, or whose quote carries an uncertainty marker →
 *     downgrade. Markers match on the accented quote always, and additionally on a stripped form
 *     WHEN THE QUOTE IS ALREADY UN-ACCENTED (a student typing "khong nho" on the text fallback).
 *     Downgrading never manufactures a penalty, but it drops the checkpoint from the coverage
 *     denominator (phantom credit, score up), so the lenient stripped pass is fenced to un-accented
 *     input — an accented voice quote with a real misconception keeps its status. Otherwise keep.
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
  const accented = normalizeAccented(raw);
  if (accented.trim() === '' || ACCENTED_MARKERS.some((marker) => marker.test(accented))) {
    return { kind: 'downgraded' };
  }
  // Lenient stripped pass ONLY when the quote is already un-accented (text fallback): fencing it to
  // un-accented input keeps a real misconception on the accented voice path from being downgraded,
  // which would inflate the score by dropping it from the coverage denominator.
  const stripped = normalizeStripped(raw);
  if (accented === stripped && STRIPPED_MARKERS.some((marker) => marker.test(stripped))) {
    return { kind: 'downgraded' };
  }
  return { kind: 'kept', status };
}

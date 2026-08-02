import {
  DEFAULT_MAX_TURNS_PER_CONCEPT,
  MAX_TURNS_PER_CONCEPT,
  decideNextStep,
  isTurnWithinLimit,
  questionModeForStep,
  type NextStep,
} from '../utils/interview-state';
import { TURN_WEIGHTS } from '../utils/mastery';
import type { Verdict } from '../schemas/ai-interview.schema';

/**
 * The Interview state machine (I6.3 / #115) — the decision table of UC-11, tested as pure
 * logic. No Prisma, no Gemini, no clock: the whole point of C4 is that this is provable
 * software logic, and of risk R05 that it stays provable with the DB and API key switched off.
 */

const MAX_TURNS = DEFAULT_MAX_TURNS_PER_CONCEPT;

function step(
  verdict: Verdict,
  turnIndex: number,
  remainingConcepts = 1,
  maxTurns = MAX_TURNS
): NextStep {
  return decideNextStep({ verdict, turnIndex, maxTurns, remainingConcepts });
}

describe('decideNextStep — continuing the same concept', () => {
  it('asks a deeper question after a deep answer while turns remain', () => {
    expect(step('deep', 1)).toBe('ask_deeper');
    expect(step('deep', 2)).toBe('ask_deeper');
  });

  it('probes after a shallow answer while turns remain', () => {
    expect(step('shallow', 1)).toBe('ask_probe');
    expect(step('shallow', 2)).toBe('ask_probe');
  });

  it('maps each continuing step to the generate_question mode the caller must use', () => {
    expect(questionModeForStep('ask_deeper')).toBe('deeper');
    expect(questionModeForStep('ask_probe')).toBe('probe');
  });

  it('has no mode for the two terminal steps — they end a concept instead of asking', () => {
    expect(questionModeForStep('finish_concept')).toBeNull();
    expect(questionModeForStep('finish_session')).toBeNull();
  });
});

describe('decideNextStep — ending a concept', () => {
  it('ends the concept immediately on a wrong answer, even with turns to spare', () => {
    expect(step('wrong', 1)).toBe('finish_concept');
    expect(step('wrong', 2)).toBe('finish_concept');
  });

  it('ends the session instead when the wrong answer was on the last concept', () => {
    expect(step('wrong', 1, 0)).toBe('finish_session');
  });

  it('ends the concept when the turn budget runs out, whatever the verdict (C6)', () => {
    expect(step('deep', MAX_TURNS)).toBe('finish_concept');
    expect(step('shallow', MAX_TURNS)).toBe('finish_concept');
    expect(step('wrong', MAX_TURNS)).toBe('finish_concept');
  });

  it('ends the session when the turn budget runs out on the last concept', () => {
    expect(step('deep', MAX_TURNS, 0)).toBe('finish_session');
  });

  it('honours a session-specific turn limit rather than the default', () => {
    expect(step('deep', 1, 1, 1)).toBe('finish_concept');
    expect(step('deep', 1, 1, 2)).toBe('ask_deeper');
  });

  it('still stops if a turnIndex somehow ran past the limit', () => {
    expect(step('deep', MAX_TURNS + 1)).toBe('finish_concept');
  });
});

describe('decideNextStep — the whole table (C6 hard limit)', () => {
  const verdicts: Verdict[] = ['deep', 'shallow', 'wrong'];

  it('never asks another question on the last allowed turn', () => {
    for (const verdict of verdicts) {
      for (let remaining = 0; remaining <= 2; remaining++) {
        const decision = step(verdict, MAX_TURNS, remaining);
        expect(['finish_concept', 'finish_session']).toContain(decision);
      }
    }
  });

  it('never routes a wrong answer to another question on the same concept', () => {
    for (let turnIndex = 1; turnIndex <= MAX_TURNS; turnIndex++) {
      expect(questionModeForStep(step('wrong', turnIndex))).toBeNull();
    }
  });

  it('has no traceback branch — that decision belongs to finalizeConceptResult (audit A5)', () => {
    const decisions = new Set<NextStep>();
    for (const verdict of verdicts) {
      for (let turnIndex = 1; turnIndex <= MAX_TURNS; turnIndex++) {
        decisions.add(step(verdict, turnIndex, 1));
        decisions.add(step(verdict, turnIndex, 0));
      }
    }
    expect([...decisions].sort()).toEqual([
      'ask_deeper',
      'ask_probe',
      'finish_concept',
      'finish_session',
    ]);
  });
});

describe('turn limits', () => {
  it('caps a concept at as many turns as the mastery formula has weights', () => {
    // If these ever diverge, calculateMasteryScore throws on the extra turn (RangeError) and
    // a session dies mid-concept. The two constants describe the same limit.
    expect(MAX_TURNS_PER_CONCEPT).toBe(TURN_WEIGHTS.length);
    expect(DEFAULT_MAX_TURNS_PER_CONCEPT).toBeLessThanOrEqual(MAX_TURNS_PER_CONCEPT);
  });

  it('accepts only turns inside the session limit', () => {
    expect(isTurnWithinLimit(1, 3)).toBe(true);
    expect(isTurnWithinLimit(3, 3)).toBe(true);
    expect(isTurnWithinLimit(4, 3)).toBe(false);
    expect(isTurnWithinLimit(0, 3)).toBe(false);
  });

  it('clamps to the global maximum even if a session row claims a bigger limit', () => {
    expect(isTurnWithinLimit(MAX_TURNS_PER_CONCEPT + 1, 10)).toBe(false);
  });
});

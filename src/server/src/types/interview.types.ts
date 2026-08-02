import type { InterviewSessionStatus, QuestionType, TurnSource, TurnVerdict } from '@prisma/client';
import type { TracebackReason } from '../services/traceback.service';
import type { TracebackSkipReason } from '../services/concept-result.service';

/**
 * Response shapes of the Interview API (I6.3 / #115), consumed by the interview screen (I6.6)
 * and the end-of-session screen (I6.7).
 *
 * Everything here is derived from `interview_sessions` / `interview_turns` on each request:
 * the session state lives in the database, never in a module-level variable, so a server
 * restart mid-session loses nothing (#115's "Stateless HTTP" constraint).
 */

/** Where the student is: which concept of the queue, which turn of that concept. */
export interface InterviewProgress {
  /** 0-based position in `conceptQueue`; equals `conceptTotal` once the session is done. */
  conceptIndex: number;
  conceptTotal: number;
  /** Concepts already finalised — what a "2/3 khái niệm" progress line shows. */
  completedConcepts: number;
  /** 1-based turn the pending question belongs to, or `null` when none is waiting. */
  turnIndex: number | null;
  /** The session's own C6 limit, so the client can render "lượt 2/3" without guessing. */
  maxTurnsPerConcept: number;
}

export interface InterviewSessionState {
  id: string;
  planId: string;
  status: InterviewSessionStatus;
  /** True once any Gemini call failed in this session — the client switches to AE-05 fallback. */
  fallbackMode: boolean;
  startedAt: Date;
  endedAt: Date | null;
  currentConcept: { id: string; name: string } | null;
  progress: InterviewProgress;
}

/** The question waiting for an answer. `turnId` is what `POST /answers` writes onto. */
export interface InterviewQuestionResponse {
  turnId: string;
  conceptId: string;
  conceptName: string;
  turnIndex: number;
  questionText: string;
  questionType: QuestionType | null;
  /** `ai` normally, `cache_fallback` once I6.4 serves a pre-generated question. */
  source: TurnSource;
}

/** One line of the transcript. Answered turns carry the grade the AI gave them. */
export interface InterviewTurnResponse {
  id: string;
  conceptId: string;
  conceptName: string;
  turnIndex: number;
  questionText: string;
  questionType: QuestionType | null;
  answerText: string | null;
  score: number | null;
  feedback: string | null;
  verdict: TurnVerdict | null;
  askedAt: Date;
  answeredAt: Date | null;
}

/** A weak prerequisite the traceback queued ahead of the concept just finished (AE-07). */
export interface InterviewPrerequisiteResponse {
  conceptId: string;
  name: string;
  depth: number;
  reason: TracebackReason;
  masteryScore: number | null;
}

/**
 * What `finalizeConceptResult()` (I7.2) decided when a concept ended: its mastery score, when
 * it comes back, and which foundations were queued before it.
 */
export interface ConceptCompletedResponse {
  conceptId: string;
  conceptName: string;
  /** `null` when no turn of the concept could be graded — the stored score was left alone. */
  masteryScore: number | null;
  reviewInDays: number;
  scheduledFor: Date;
  prerequisites: InterviewPrerequisiteResponse[];
  /** Why no prerequisite was queued; `null` means the traceback actually ran. */
  tracebackSkipReason: TracebackSkipReason | null;
}

/**
 * Which AI call was unavailable, so the client knows what it is falling back *from*: the
 * grade of the answer just sent, or the next question. Both keep the session alive — an AI
 * outage must never kill a session (#115), and I6.4 plugs the flashcard flow in here.
 */
export type InterviewFallbackReason = 'grading_unavailable' | 'question_unavailable';

export interface InterviewFallbackResponse {
  reason: InterviewFallbackReason;
  message: string;
}

export interface StartInterviewResponse {
  /** `false` when an unfinished session already existed and is being handed back (AE-03). */
  created: boolean;
  session: InterviewSessionState;
  question: InterviewQuestionResponse | null;
  /** Resume hint, or the reason there is no question yet. `null` on the ordinary path. */
  message: string | null;
  fallback: InterviewFallbackResponse | null;
}

export interface GetInterviewResponse {
  session: InterviewSessionState;
  currentQuestion: InterviewQuestionResponse | null;
  /** Whole transcript of the session, oldest first — at most 5 concepts × 3 turns. */
  turns: InterviewTurnResponse[];
  fallback: InterviewFallbackResponse | null;
}

export interface SubmitAnswerResponse {
  session: InterviewSessionState;
  /** `null` when grading was unavailable — see `fallback`. */
  grading: { score: number; feedback: string; verdict: TurnVerdict } | null;
  gradedTurnId: string;
  nextQuestion: InterviewQuestionResponse | null;
  /** Set only on the request that ended a concept. */
  conceptCompleted: ConceptCompletedResponse | null;
  sessionCompleted: boolean;
  /**
   * True when this answer had already been graded and the stored result is being replayed
   * (double-click / retried request). No second turn was created — but the request that won
   * may still have been mid-flight, so treat `nextQuestion` here as a hint and take
   * `GET /interviews/:id` as authoritative.
   */
  replayed: boolean;
  fallback: InterviewFallbackResponse | null;
}

export interface PauseInterviewResponse {
  session: InterviewSessionState;
}

export interface ResumeInterviewResponse {
  session: InterviewSessionState;
  currentQuestion: InterviewQuestionResponse | null;
  fallback: InterviewFallbackResponse | null;
}

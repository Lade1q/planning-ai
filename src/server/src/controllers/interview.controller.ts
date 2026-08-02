import { Request, Response } from 'express';
import {
  getInterview,
  pauseInterview,
  resumeInterview,
  startInterview,
  submitAnswer,
} from '../services/interview.service';
import {
  createInterviewSchema,
  interviewIdParamSchema,
  submitAnswerSchema,
} from '../schemas/interview.schema';
import { AppError } from '../middleware/errorHandler';

/**
 * Interview API (I6.3 / #115). Every route is mounted behind `authMiddleware`, and every
 * handler validates its input with Zod before the service is reached (conventions §4.4).
 */

/**
 * POST /api/v1/interviews — AE-01. Starts a session and returns its first question.
 *
 * `201` for a session that was created, `200` when an unfinished one already existed and is
 * being handed back to resume (AE-03) — the body carries it either way, so the client can
 * offer "tiếp tục phiên" instead of hitting a dead end.
 */
export async function createInterviewController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const input = createInterviewSchema.parse(req.body);

  const result = await startInterview(req.userId, input);

  res.status(result.created ? 201 : 200).json({
    success: true,
    data: result,
  });
}

/**
 * GET /api/v1/interviews/:id
 * Current state, the question waiting for an answer, and the transcript so far.
 */
export async function getInterviewController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { id } = interviewIdParamSchema.parse(req.params);

  const result = await getInterview(id, req.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
}

/**
 * POST /api/v1/interviews/:id/answers — AE-02.
 * Grades the answer, runs the state machine, and returns what happens next.
 */
export async function submitAnswerController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { id } = interviewIdParamSchema.parse(req.params);
  const { answerText } = submitAnswerSchema.parse(req.body);

  const result = await submitAnswer(id, req.userId, answerText);

  res.status(200).json({
    success: true,
    data: result,
  });
}

/** POST /api/v1/interviews/:id/pause — AE-03. */
export async function pauseInterviewController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { id } = interviewIdParamSchema.parse(req.params);

  const result = await pauseInterview(id, req.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
}

/** POST /api/v1/interviews/:id/resume — AE-03. */
export async function resumeInterviewController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { id } = interviewIdParamSchema.parse(req.params);

  const result = await resumeInterview(id, req.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
}

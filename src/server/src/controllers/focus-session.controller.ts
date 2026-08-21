import { Request, Response } from 'express';
import {
  createFocusSession,
  endFocusSession,
  getCurrentFocusSession,
  listFocusSessions,
} from '../services/focus-session.service';
import {
  createFocusSessionSchema,
  endFocusSessionSchema,
  focusSessionIdParamSchema,
  listFocusSessionsQuerySchema,
} from '../schemas/focus-session.schema';
import { AppError } from '../middleware/errorHandler';

/**
 * `201` for a session that was created, `200` when a `running` one already existed and is
 * being handed back instead (#328) — same convention as `createInterviewController`.
 */
export async function createFocusSessionController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const input = createFocusSessionSchema.parse(req.body);
  const session = await createFocusSession(req.userId, input);

  res.status(session.created ? 201 : 200).json({ success: true, data: session });
}

export async function endFocusSessionController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { id } = focusSessionIdParamSchema.parse(req.params);
  const input = endFocusSessionSchema.parse(req.body);
  const session = await endFocusSession(req.userId, id, input);

  res.status(200).json({ success: true, data: session });
}

export async function listFocusSessionsController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { limit, offset } = listFocusSessionsQuerySchema.parse(req.query);
  const sessions = await listFocusSessions(req.userId, { limit, offset });

  res.status(200).json({ success: true, data: sessions });
}

/** Phiên `running` hiện tại của user, nếu có (#374) — để FE dựng khối "phiên đang chạy". */
export async function getCurrentFocusSessionController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const session = await getCurrentFocusSession(req.userId);

  res.status(200).json({ success: true, data: session });
}

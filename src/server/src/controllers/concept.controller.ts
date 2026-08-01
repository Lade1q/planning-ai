import { Request, Response } from 'express';
import { getConceptDetail } from '../services/concept-detail.service';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/v1/plans/:id/concepts/:conceptId
 * DB-06's detail panel (Issue #168): mastery/remediation state, source excerpts, and
 * learning history for one concept. Read-only — see `concept-detail.service.ts`.
 */
export async function getConceptDetailController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  // mergeParams on the router makes `id` (the plan) visible alongside `conceptId` here —
  // same pattern as graph.routes.ts.
  const { id, conceptId } = req.params;
  if (!id || typeof id !== 'string' || !conceptId || typeof conceptId !== 'string') {
    throw new AppError('Plan ID and Concept ID are required', 400, 'BAD_REQUEST');
  }

  const concept = await getConceptDetail(id, conceptId, req.userId);

  res.status(200).json({
    success: true,
    data: concept,
  });
}

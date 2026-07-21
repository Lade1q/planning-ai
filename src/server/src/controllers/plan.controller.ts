import { Request, Response } from 'express';
import { createPlan, getUserPlans, getPlanById } from '../services/plan.service';
import { createPlanSchema } from '../schemas/plan.schema';
import { AppError } from '../middleware/errorHandler';

/**
 * POST /api/v1/plans
 * Creates a new StudyPlan and triggers background analysis.
 * Expects multipart/form-data with fields: name, deadline, file.
 */
export async function createPlanController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  if (!req.file) {
    throw new AppError('File is required', 400, 'FILE_REQUIRED');
  }

  const input = createPlanSchema.parse(req.body);

  const plan = await createPlan(req.userId, input, req.file.path);

  res.status(201).json({
    success: true,
    data: {
      plan,
      message: 'Plan created',
    },
  });
}

/**
 * GET /api/v1/plans
 * Lists all study plans belonging to the current user.
 */
export async function listPlansController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const plans = await getUserPlans(req.userId);

  res.status(200).json({
    success: true,
    data: {
      plans,
    },
  });
}

/**
 * GET /api/v1/plans/:id
 * Fetches details of a specific study plan including concepts and edges.
 */
export async function getPlanByIdController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new AppError('Plan ID is required', 400, 'BAD_REQUEST');
  }

  const plan = await getPlanById(id, req.userId);

  res.status(200).json({
    success: true,
    data: plan,
  });
}

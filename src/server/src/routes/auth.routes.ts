import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshController,
  getMeController,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/errorHandler';

const authRouter = Router();

// Public routes
authRouter.post('/register', asyncHandler(registerController));
authRouter.post('/login', asyncHandler(loginController));
authRouter.post('/refresh', asyncHandler(refreshController));

// Protected routes
authRouter.get('/me', authMiddleware, asyncHandler(getMeController));

export { authRouter };

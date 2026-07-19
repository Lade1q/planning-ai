import { Request, Response } from 'express';
import {
  register,
  login,
  refresh,
  getMe,
  registerSchema,
  loginSchema,
  refreshSchema,
} from '../services/auth.service';

/**
 * POST /api/auth/register
 * Register a new user account.
 * Returns 201 with user info + tokens on success.
 */
export async function registerController(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);
  const result = await register(input);
  res.status(201).json({ success: true, data: result });
}

/**
 * POST /api/auth/login
 * Authenticate user with email and password.
 * Returns 200 with user info + tokens on success.
 */
export async function loginController(req: Request, res: Response): Promise<void> {
  const input = loginSchema.parse(req.body);
  const result = await login(input);
  res.status(200).json({ success: true, data: result });
}

/**
 * POST /api/auth/refresh
 * Refresh access token using a valid refresh token.
 * Returns 200 with { accessToken } on success.
 */
export async function refreshController(req: Request, res: Response): Promise<void> {
  const input = refreshSchema.parse(req.body);
  const result = await refresh(input);
  res.status(200).json({ success: true, data: result });
}

/**
 * GET /api/auth/me
 * Get current authenticated user's profile.
 * Returns 200 with user info on success.
 */
export async function getMeController(req: Request, res: Response): Promise<void> {
  // authMiddleware ensures req.userId is set
  const user = await getMe(req.userId as string);
  res.status(200).json({ success: true, data: user });
}

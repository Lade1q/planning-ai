import { Request, Response } from "express";
import {
  register,
  login,
  refresh,
  getMe,
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../services/auth.service";

/**
 * POST /api/auth/register
 * Register a new user account.
 * Returns 201 with user info + tokens on success.
 * Returns 409 with { error: "Email already exists" } on duplicate.
 * Returns 400 with { error: string } on validation failure.
 */
export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Validate input
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      return;
    }

    const result = await register(parsed.data);
    res.status(201).json(result);
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
}

/**
 * POST /api/auth/login
 * Authenticate user with email and password.
 * Returns 200 with user info + tokens on success.
 * Returns 401 with { error: "Email or password incorrect" } on failure.
 */
export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Validate input
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      return;
    }

    const result = await login(parsed.data);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
}

/**
 * POST /api/auth/refresh
 * Refresh access token using a valid refresh token.
 * Returns 200 with { accessToken } on success.
 * Returns 401 on invalid/expired refresh token.
 */
export async function refreshController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Validate input
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      return;
    }

    const result = await refresh(parsed.data);
    res.status(200).json(result);
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user's profile.
 * Requires authMiddleware to be applied before this handler.
 * Returns 200 with user info on success.
 */
export async function getMeController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await getMe(req.userId);
    res.status(200).json(user);
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
}

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';

/**
 * Authentication guard middleware.
 * - Checks for Bearer token in Authorization header
 * - Verifies the access token
 * - Attaches userId and user payload to the request
 * - Passes AppError to next() if token is missing, invalid, or expired
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token not provided', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Token not provided', 401, 'UNAUTHORIZED'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new AppError('Server configuration error', 500, 'SERVER_ERROR'));
  }

  try {
    const decoded = verifyToken(token, secret);
    req.userId = decoded.userId;
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
}

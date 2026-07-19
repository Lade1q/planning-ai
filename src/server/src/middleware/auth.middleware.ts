import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';

/**
 * Authentication guard middleware.
 * - Checks for Bearer token in Authorization header
 * - Verifies the access token
 * - Attaches userId and user payload to the request
 * - Throws AppError if token is missing, invalid, or expired
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token không được cung cấp', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('Token không được cung cấp', 401, 'UNAUTHORIZED');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Server configuration error', 500, 'SERVER_ERROR');
  }

  try {
    const decoded = verifyToken(token, secret);
    req.userId = decoded.userId;
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    throw new AppError('Token không hợp lệ hoặc đã hết hạn', 401, 'UNAUTHORIZED');
  }
}

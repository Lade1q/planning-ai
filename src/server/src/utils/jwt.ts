import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Generate an access token.
 */
export function generateAccessToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(
      'JWT_SECRET is not defined in environment variables',
      500,
      'SERVER_CONFIG_ERROR'
    );
  }
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  return jwt.sign(payload, secret, { expiresIn: expiresIn as SignOptions['expiresIn'] });
}

/**
 * Generate a refresh token.
 */
export function generateRefreshToken(payload: JwtPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new AppError(
      'JWT_REFRESH_SECRET is not defined in environment variables',
      500,
      'SERVER_CONFIG_ERROR'
    );
  }
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn: expiresIn as SignOptions['expiresIn'] });
}

/**
 * Verify and decode a JWT token.
 * Throws if the token is invalid or expired.
 */
export function verifyToken(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/auth.schema';
import { AuthResponse, RefreshResponse, UserResponse } from '../types/auth.types';

const SALT_ROUNDS = 10;

/**
 * Register a new user account.
 * - Validates input with Zod
 * - Checks for duplicate email
 * - Hashes password with bcryptjs (salt rounds = 10)
 * - Creates user in DB
 * - Returns user info + token pair
 */
export async function register(data: z.infer<typeof registerSchema>): Promise<AuthResponse> {
  // Check duplicate email
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email already exists', 409, 'EMAIL_CONFLICT');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Create user in DB
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
    },
  });

  // Generate tokens
  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
}

/**
 * Login an existing user.
 * - Finds user by email
 * - Compares password hash
 * - Returns user info + token pair
 */
export async function login(data: z.infer<typeof loginSchema>): Promise<AuthResponse> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError('Email or password incorrect', 401, 'UNAUTHORIZED');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Email or password incorrect', 401, 'UNAUTHORIZED');
  }

  // Generate tokens
  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh access token using a valid refresh token.
 * - Verifies refresh token
 * - Checks user still exists in DB
 * - Issues new access token
 */
export async function refresh(data: z.infer<typeof refreshSchema>): Promise<RefreshResponse> {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new AppError(
      'JWT_REFRESH_SECRET is not defined in environment variables',
      500,
      'SERVER_CONFIG_ERROR'
    );
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyToken(data.refreshToken, secret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
  }

  // Check user still exists
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new AppError('User not found', 401, 'UNAUTHORIZED');
  }

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  return { accessToken };
}

/**
 * Get current user info by userId.
 */
export async function getMe(userId: string): Promise<UserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  return { id: user.id, email: user.email, name: user.name };
}

import bcrypt from "bcryptjs";
import { z } from "zod/v4";
import prisma from "../config/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";

// ============================================
// Zod Validation Schemas
// ============================================

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// ============================================
// Response Types
// ============================================

interface UserResponse {
  id: string;
  email: string;
  name: string | null;
}

interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

// ============================================
// Service Functions
// ============================================

const SALT_ROUNDS = 10;

/**
 * Register a new user account.
 * - Validates input with Zod
 * - Checks for duplicate email
 * - Hashes password with bcryptjs (salt rounds = 10)
 * - Creates user in DB
 * - Returns user info + token pair
 */
export async function register(
  data: z.infer<typeof registerSchema>,
): Promise<AuthResponse> {
  // Check duplicate email
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    const error = new Error("Email already exists") as Error & {
      statusCode: number;
    };
    error.statusCode = 409;
    throw error;
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
export async function login(
  data: z.infer<typeof loginSchema>,
): Promise<AuthResponse> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    const error = new Error("Email or password incorrect") as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Email or password incorrect") as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
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
export async function refresh(
  data: z.infer<typeof refreshSchema>,
): Promise<RefreshResponse> {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables",
    );
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyToken(data.refreshToken, secret);
  } catch {
    const error = new Error("Invalid or expired refresh token") as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
  }

  // Check user still exists
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    const error = new Error("User not found") as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
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
    const error = new Error("User not found") as Error & {
      statusCode: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return { id: user.id, email: user.email, name: user.name };
}

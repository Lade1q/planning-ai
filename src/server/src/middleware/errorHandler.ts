import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Custom application error class.
 */
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Global centralized error handler middleware.
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: err.issues,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'APP_ERROR',
        message: err.message,
      },
    });
  }

  // Handle other known built-in errors (like JSON parsing error)
  if ('status' in err && typeof err.status === 'number' && 'message' in err) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: err.message,
      },
    });
  }

  // Handle default unhandled errors
  console.error('Unhandled error occurrence:', err);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
}

/**
 * Async handler wrapper to catch unhandled promise rejections
 * and forward them to the global error handler.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

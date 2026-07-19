import { Request, Response, NextFunction } from 'express';

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
      message: 'Lỗi hệ thống',
    },
  });
}

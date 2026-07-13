import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { ErrorCodes } from '../types/api';
import { env } from '../config/env';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: ErrorCodes.VALIDATION_ERROR,
        details: err.errors.map((issue) => ({
          field: issue.path.join('.') || 'body',
          message: issue.message,
        })),
      },
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: {
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err.message,
      code: ErrorCodes.INTERNAL_ERROR,
    },
  });
}

import { ErrorCode } from '../types/api';

export interface AppErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: AppErrorDetail[];

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    details?: AppErrorDetail[],
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, 'NOT_FOUND', message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: AppErrorDetail[]) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class InvalidStatusTransitionError extends AppError {
  constructor(message: string) {
    super(409, 'INVALID_STATUS_TRANSITION', message);
    this.name = 'InvalidStatusTransitionError';
  }
}

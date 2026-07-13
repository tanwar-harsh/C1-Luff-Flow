import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { isApiError } from '@/services/api';

export interface ParsedApiError {
  message: string;
  code?: string;
  fieldErrors: Record<string, string>;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (isApiError(error)) {
    const apiError = error.response!.data.error;
    const fieldErrors: Record<string, string> = {};
    for (const detail of apiError.details ?? []) {
      fieldErrors[detail.field] = detail.message;
    }
    return {
      message: apiError.message,
      code: apiError.code,
      fieldErrors,
    };
  }

  if (error instanceof AxiosError) {
    return {
      message: error.message || 'Network error',
      fieldErrors: {},
    };
  }

  return {
    message: 'An unexpected error occurred',
    fieldErrors: {},
  };
}

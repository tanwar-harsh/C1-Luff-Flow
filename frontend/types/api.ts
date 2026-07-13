export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  message: string;
  code: string;
  details?: ApiErrorDetail[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

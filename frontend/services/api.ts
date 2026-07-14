import axios, { AxiosError } from 'axios';
import { ApiErrorResponse, ApiResponse } from '@/types/api';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export function isApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError(error) && error.response?.data?.success === false;
}

export async function apiGet<T>(url: string): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(url);
  if (!data.success) throw data;
  return data.data;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  if (!data.success) throw data;
  return data.data;
}

export async function apiPut<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.put<ApiResponse<T>>(url, body);
  if (!data.success) throw data;
  return data.data;
}

export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.patch<ApiResponse<T>>(url, body);
  if (!data.success) throw data;
  return data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<ApiResponse<T>>(url);
  if (!data.success) throw data;
  return data.data;
}

import { apiGet, apiPost } from './api';
import { UserSummary } from '@/types/domain';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function login(input: LoginInput): Promise<{ user: UserSummary }> {
  return apiPost<{ user: UserSummary }>('/auth/login', input);
}

export async function register(input: RegisterInput): Promise<{ user: UserSummary }> {
  return apiPost<{ user: UserSummary }>('/auth/register', input);
}

export async function logout(): Promise<void> {
  await apiPost<{ message: string }>('/auth/logout', {});
}

export async function fetchCurrentUser(): Promise<UserSummary | null> {
  try {
    const data = await apiGet<{ user: UserSummary }>('/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import { Role, UserSummary } from '@/types/domain';

export interface PaginatedUsers {
  items: UserSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface UpdateMeInput {
  name?: string;
  email?: string;
}

export async function fetchUsersPaginated(
  page = 1,
  limit = 10,
): Promise<PaginatedUsers> {
  return apiGet<PaginatedUsers>(`/users?page=${page}&limit=${limit}`);
}

export async function fetchUserById(id: string): Promise<UserSummary> {
  return apiGet<UserSummary>(`/users/${id}`);
}

/** For assignment dropdowns (ADMIN/AGENT) */
export async function fetchAssignees(): Promise<UserSummary[]> {
  return apiGet<UserSummary[]>('/users/assignees');
}

/** @deprecated Use fetchAssignees for ticket forms */
export async function fetchUsers(): Promise<UserSummary[]> {
  return fetchAssignees();
}

export async function createUser(input: CreateUserInput): Promise<UserSummary> {
  return apiPost<UserSummary>('/users', input);
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<UserSummary> {
  return apiPatch<UserSummary>(`/users/${id}`, input);
}

export async function updateMe(input: UpdateMeInput): Promise<UserSummary> {
  return apiPatch<UserSummary>('/users/me', input);
}

export async function deleteUser(id: string): Promise<void> {
  await apiDelete<{ message: string }>(`/users/${id}`);
}

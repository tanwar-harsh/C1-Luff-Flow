import { apiGet } from './api';
import { UserSummary } from '@/types/domain';

export async function fetchUsers(): Promise<UserSummary[]> {
  return apiGet<UserSummary[]>('/users');
}

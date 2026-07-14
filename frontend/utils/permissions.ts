import { Role } from '@/types/domain';

export function canViewTickets(role: Role | undefined): boolean {
  return role === 'USER' || role === 'AGENT' || role === 'ADMIN';
}

export function canCreateTicket(role: Role | undefined): boolean {
  return role === 'AGENT' || role === 'ADMIN';
}

export function canMutateTicket(role: Role | undefined): boolean {
  return role === 'AGENT' || role === 'ADMIN';
}

export function canManageUsers(role: Role | undefined): boolean {
  return role === 'ADMIN';
}

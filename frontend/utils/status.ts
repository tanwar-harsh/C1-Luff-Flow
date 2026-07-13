import { TicketStatus } from '@/types/domain';

export const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
};

export const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export function getNextStatuses(current: TicketStatus): TicketStatus[] {
  return VALID_TRANSITIONS[current];
}

export function statusToTailwindKey(status: TicketStatus): string {
  return status.toLowerCase().replace('_', '-');
}

export function priorityToTailwindKey(priority: string): string {
  return priority.toLowerCase();
}

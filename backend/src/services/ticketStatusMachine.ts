import { TicketStatus } from '../types/domain';
import { InvalidStatusTransitionError } from '../utils/AppError';

export const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

export function validateStatusTransition(
  currentStatus: TicketStatus,
  requestedStatus: TicketStatus,
): void {
  if (currentStatus === requestedStatus) {
    throw new InvalidStatusTransitionError(
      `Invalid status transition from ${currentStatus} to ${requestedStatus}`,
    );
  }

  if (!VALID_TRANSITIONS[currentStatus].includes(requestedStatus)) {
    throw new InvalidStatusTransitionError(
      `Invalid status transition from ${currentStatus} to ${requestedStatus}`,
    );
  }
}

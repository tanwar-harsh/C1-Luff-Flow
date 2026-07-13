import { TicketStatus } from '@/types/domain';
import { STATUS_LABELS, statusToTailwindKey } from '@/utils/status';

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusBgClasses: Record<TicketStatus, string> = {
  OPEN: 'bg-status-open/10 text-status-open',
  IN_PROGRESS: 'bg-status-in-progress/10 text-status-in-progress',
  RESOLVED: 'bg-status-resolved/10 text-status-resolved',
  CLOSED: 'bg-status-closed/10 text-status-closed',
  CANCELLED: 'bg-status-cancelled/10 text-status-cancelled',
};

const statusDotClasses: Record<TicketStatus, string> = {
  OPEN: 'bg-status-open',
  IN_PROGRESS: 'bg-status-in-progress',
  RESOLVED: 'bg-status-resolved',
  CLOSED: 'bg-status-closed',
  CANCELLED: 'bg-status-cancelled',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-sm uppercase ${statusBgClasses[status]}`}
    >
      <span className={`h-1 w-1 rounded-full ${statusDotClasses[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

// Keep statusToTailwindKey exported usage in other files if needed
export { statusToTailwindKey };

import { Priority } from '@/types/domain';
import { PRIORITY_LABELS } from '@/utils/status';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityColorClasses: Record<Priority, string> = {
  LOW: 'text-priority-low',
  MEDIUM: 'text-priority-medium',
  HIGH: 'text-priority-high',
  CRITICAL: 'text-priority-critical',
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`text-label-sm font-bold uppercase ${priorityColorClasses[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

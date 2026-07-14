import { Role } from '@/types/domain';
import { ROLE_LABELS } from '@/utils/status';

interface RoleBadgeProps {
  role: Role;
}

const roleClasses: Record<Role, string> = {
  ADMIN: 'bg-primary/10 text-primary',
  AGENT: 'bg-status-in-progress/10 text-status-in-progress',
  USER: 'bg-status-closed/10 text-status-closed',
};

const roleDotClasses: Record<Role, string> = {
  ADMIN: 'bg-primary',
  AGENT: 'bg-status-in-progress',
  USER: 'bg-status-closed',
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-sm uppercase ${roleClasses[role]}`}
    >
      <span className={`h-1 w-1 rounded-full ${roleDotClasses[role]}`} />
      {ROLE_LABELS[role]}
    </span>
  );
}

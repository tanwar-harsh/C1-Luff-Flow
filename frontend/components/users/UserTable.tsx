'use client';

import { UserSummary } from '@/types/domain';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Button } from '@/components/ui/Button';

interface UserTableProps {
  users: UserSummary[];
  onEdit: (user: UserSummary) => void;
  onDelete: (user: UserSummary) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <p className="py-12 text-center text-body-md text-on-surface-variant">
        No users found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-container-high text-left">
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Name</th>
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Email</th>
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Role</th>
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-surface-container-high transition-colors hover:bg-row-hover"
            >
              <td className="px-4 py-3 text-headline-sm text-foreground">{user.name}</td>
              <td className="px-4 py-3 font-mono text-label-md text-on-surface-variant">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" type="button" onClick={() => onEdit(user)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    className="text-error hover:text-error"
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

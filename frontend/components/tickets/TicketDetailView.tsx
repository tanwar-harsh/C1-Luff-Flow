'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TicketWithRelations, UserSummary } from '@/types/domain';
import { updateTicket } from '@/services/ticketService';
import { parseApiError } from '@/utils/errors';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { CommentList } from '@/components/tickets/CommentList';
import { CommentForm } from '@/components/tickets/CommentForm';
import { StatusActions } from '@/components/tickets/StatusActions';
import { formatDate, formatTicketId } from '@/utils/format';

interface TicketDetailViewProps {
  initialTicket: TicketWithRelations;
  users: UserSummary[];
}

export function TicketDetailView({ initialTicket, users }: TicketDetailViewProps) {
  const { canMutateTicket } = useAuth();
  const [ticket, setTicket] = useState(initialTicket);
  const [isEditing, setIsEditing] = useState(false);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedToId ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refreshTicket = async () => {
    const { fetchTicketById } = await import('@/services/ticketService');
    const updated = await fetchTicketById(ticket.id);
    setTicket(updated);
  };

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.role})`,
  }));

  const handleAssign = async () => {
    setError(null);
    setSaving(true);
    try {
      await updateTicket(ticket.id, {
        assignedTo: assignedTo || null,
      });
      await refreshTicket();
      setIsEditing(false);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="rounded-lg bg-surface-container-lowest p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-label-md text-on-surface-variant">
              {formatTicketId(ticket.id)}
            </span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <h2 className="text-headline-md text-foreground">{ticket.title}</h2>
          <p className="mt-3 text-body-lg text-foreground whitespace-pre-wrap">
            {ticket.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 font-mono text-label-md text-on-surface-variant">
            <span>Created by {ticket.createdBy.name}</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-headline-md text-foreground">Comments</h3>
          <CommentList comments={ticket.comments} />
          {canMutateTicket && (
            <div className="mt-6">
              <CommentForm ticketId={ticket.id} onCommentAdded={refreshTicket} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-lg bg-surface-container-lowest p-6">
          <h3 className="mb-4 text-headline-md text-foreground">Status</h3>
          {canMutateTicket ? (
            <StatusActions
              ticketId={ticket.id}
              currentStatus={ticket.status}
              onStatusChanged={refreshTicket}
            />
          ) : (
            <StatusBadge status={ticket.status} />
          )}
        </div>

        <div className="rounded-lg bg-surface-container-lowest p-6">
          <h3 className="mb-4 text-headline-md text-foreground">Assignment</h3>
          {canMutateTicket ? (
            <>
              {error && <Alert message={error} />}
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <Select
                    label="Assignee"
                    options={userOptions}
                    placeholder="Unassigned"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAssign} isLoading={saving}>
                      Save
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-body-md text-foreground">
                    {ticket.assignedTo?.name ?? 'Unassigned'}
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => setIsEditing(true)}
                  >
                    Change Assignee
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-body-md text-foreground">
              {ticket.assignedTo?.name ?? 'Unassigned'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

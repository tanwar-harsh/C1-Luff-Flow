'use client';

import { useState } from 'react';
import { TicketStatus } from '@/types/domain';
import { updateTicketStatus } from '@/services/ticketService';
import { getNextStatuses, STATUS_LABELS } from '@/utils/status';
import { parseApiError } from '@/utils/errors';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface StatusActionsProps {
  ticketId: string;
  currentStatus: TicketStatus;
  onStatusChanged: () => void;
}

export function StatusActions({
  ticketId,
  currentStatus,
  onStatusChanged,
}: StatusActionsProps) {
  const [loading, setLoading] = useState<TicketStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nextStatuses = getNextStatuses(currentStatus);

  if (nextStatuses.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        This ticket is in a terminal state ({STATUS_LABELS[currentStatus]}).
      </p>
    );
  }

  const handleTransition = async (status: TicketStatus) => {
    setError(null);
    setLoading(status);
    try {
      await updateTicketStatus(ticketId, status);
      onStatusChanged();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && <Alert message={error} />}
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((status) => (
          <Button
            key={status}
            variant={status === 'CANCELLED' ? 'secondary' : 'primary'}
            isLoading={loading === status}
            onClick={() => handleTransition(status)}
          >
            Move to {STATUS_LABELS[status]}
          </Button>
        ))}
      </div>
    </div>
  );
}

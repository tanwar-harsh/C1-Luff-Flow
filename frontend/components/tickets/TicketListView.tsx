'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { TicketTable } from '@/components/tickets/TicketTable';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { fetchTickets } from '@/services/ticketService';
import { Ticket } from '@/types/domain';
import { parseApiError } from '@/utils/errors';

export function TicketListView() {
  const { canCreateTicket } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer title="Tickets" subtitle="All support tickets, newest first">
      {canCreateTicket && (
        <div className="mb-4 flex justify-end">
          <Link href="/tickets/new">
            <Button>Create Ticket</Button>
          </Link>
        </div>
      )}

      {error && <Alert message={error} />}

      {loading ? (
        <p className="py-12 text-center text-body-md text-on-surface-variant">
          Loading tickets...
        </p>
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </PageContainer>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { TicketDetailView } from '@/components/tickets/TicketDetailView';
import { Alert } from '@/components/ui/Alert';
import { fetchTicketById } from '@/services/ticketService';
import { fetchUsers } from '@/services/userService';
import { TicketWithRelations, UserSummary } from '@/types/domain';
import { parseApiError } from '@/utils/errors';

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [ticket, setTicket] = useState<TicketWithRelations | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchTicketById(id), fetchUsers()])
      .then(([ticketData, usersData]) => {
        setTicket(ticketData);
        setUsers(usersData);
      })
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageContainer title="Ticket Details">
        <p className="text-body-md text-on-surface-variant">Loading...</p>
      </PageContainer>
    );
  }

  if (error || !ticket) {
    return (
      <PageContainer title="Ticket Details">
        <Alert message={error ?? 'Ticket not found'} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Ticket Details">
      <TicketDetailView initialTicket={ticket} users={users} />
    </PageContainer>
  );
}

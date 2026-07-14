'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { TicketDetailView } from '@/components/tickets/TicketDetailView';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { fetchTicketById } from '@/services/ticketService';
import { fetchAssignees } from '@/services/userService';
import { TicketWithRelations, UserSummary } from '@/types/domain';
import { parseApiError } from '@/utils/errors';

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { canMutateTicket } = useAuth();

  const [ticket, setTicket] = useState<TicketWithRelations | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const ticketData = await fetchTicketById(id);
        setTicket(ticketData);

        if (canMutateTicket) {
          const assignees = await fetchAssignees();
          setUsers(assignees);
        }
      } catch (err) {
        setError(parseApiError(err).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, canMutateTicket]);

  return (
    <RequireAuth>
      {loading ? (
        <PageContainer title="Ticket Details">
          <p className="text-body-md text-on-surface-variant">Loading...</p>
        </PageContainer>
      ) : error || !ticket ? (
        <PageContainer title="Ticket Details">
          <Alert message={error ?? 'Ticket not found'} />
        </PageContainer>
      ) : (
        <PageContainer title="Ticket Details">
          <TicketDetailView initialTicket={ticket} users={users} />
        </PageContainer>
      )}
    </RequireAuth>
  );
}

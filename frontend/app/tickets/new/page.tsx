'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CreateTicketForm } from '@/components/tickets/CreateTicketForm';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Alert } from '@/components/ui/Alert';
import { fetchAssignees } from '@/services/userService';
import { UserSummary } from '@/types/domain';
import { parseApiError } from '@/utils/errors';
import { canCreateTicket } from '@/utils/permissions';

export default function CreateTicketPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignees()
      .then(setUsers)
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth permission={canCreateTicket}>
      <PageContainer title="Create Ticket" subtitle="Submit a new support request">
        {error && <Alert message={error} />}
        {loading ? (
          <p className="text-body-md text-on-surface-variant">Loading...</p>
        ) : users.length > 0 ? (
          <CreateTicketForm users={users} />
        ) : (
          <Alert message="No assignees available." />
        )}
      </PageContainer>
    </RequireAuth>
  );
}

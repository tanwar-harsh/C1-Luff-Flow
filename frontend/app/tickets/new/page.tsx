'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CreateTicketForm } from '@/components/tickets/CreateTicketForm';
import { Alert } from '@/components/ui/Alert';
import { fetchUsers } from '@/services/userService';
import { UserSummary } from '@/types/domain';
import { parseApiError } from '@/utils/errors';

export default function CreateTicketPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer
      title="Create Ticket"
      subtitle="Submit a new support request"
    >
      {error && <Alert message={error} />}
      {loading ? (
        <p className="text-body-md text-on-surface-variant">Loading...</p>
      ) : users.length > 0 ? (
        <CreateTicketForm users={users} />
      ) : (
        <Alert message="No users available. Please seed the database." />
      )}
    </PageContainer>
  );
}

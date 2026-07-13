'use client';

import { useCallback, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TicketTable } from '@/components/tickets/TicketTable';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { searchTickets } from '@/services/ticketService';
import { Ticket, TicketStatus } from '@/types/domain';
import { parseApiError } from '@/utils/errors';
import { STATUS_LABELS } from '@/utils/status';

const statusOptions = [
  { value: '', label: 'All statuses' },
  ...(Object.entries(STATUS_LABELS) as [TicketStatus, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const results = await searchTickets({
        q: query || undefined,
        status: (status as TicketStatus) || undefined,
      });
      setTickets(results);
      setSearched(true);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  return (
    <PageContainer
      title="Search & Filter"
      subtitle="Find tickets by keyword or status"
    >
      <div className="mb-6 flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-6 md:flex-row md:items-end">
        <div className="flex-1">
          <Input
            label="Keyword"
            placeholder="e.g. payment"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <Button onClick={handleSearch} isLoading={loading}>
          Search
        </Button>
      </div>

      {error && <Alert message={error} />}

      {searched && (
        <p className="mb-4 font-mono text-label-md text-on-surface-variant">
          {tickets.length} result{tickets.length !== 1 ? 's' : ''} found
        </p>
      )}

      {searched && <TicketTable tickets={tickets} />}
    </PageContainer>
  );
}

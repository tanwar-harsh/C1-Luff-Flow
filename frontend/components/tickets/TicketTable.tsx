import Link from 'next/link';
import { Ticket } from '@/types/domain';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { formatDate, formatTicketId } from '@/utils/format';

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <p className="py-12 text-center text-body-md text-on-surface-variant">
        No tickets found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-container-high text-left">
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">ID</th>
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Title</th>
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Status</th>
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Priority</th>
            <th className="px-4 py-3 text-label-sm uppercase text-on-surface-variant">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-surface-container-high transition-colors hover:bg-row-hover"
            >
              <td className="px-4 py-3 font-mono text-label-md text-on-surface-variant">
                <Link href={`/tickets/${ticket.id}`} className="hover:text-primary">
                  {formatTicketId(ticket.id)}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="text-headline-sm text-foreground hover:text-primary"
                >
                  {ticket.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3 font-mono text-label-md text-on-surface-variant">
                {formatDate(ticket.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

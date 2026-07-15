import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusActions } from '@/components/tickets/StatusActions';
import { updateTicketStatus } from '@/services/ticketService';
import { getNextStatuses, STATUS_LABELS } from '@/utils/status';
import { Ticket, TicketStatus } from '@/types/domain';

vi.mock('@/services/ticketService', () => ({
  updateTicketStatus: vi.fn(),
}));

const mockTicket: Ticket = {
  id: 'ticket-1',
  title: 'Payment failed',
  description: 'Customer charged twice.',
  priority: 'HIGH',
  status: 'OPEN',
  assignedToId: null,
  createdById: 'user-1',
  createdAt: new Date('2026-07-15T12:00:00.000Z'),
  updatedAt: new Date('2026-07-15T12:00:00.000Z'),
};

function createApiError(
  status: number,
  message: string,
  code: string,
  details?: { field: string; message: string }[],
): AxiosError {
  const error = new AxiosError(message, AxiosError.ERR_BAD_REQUEST, undefined, undefined, {
    status,
    statusText: message,
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
    data: {
      success: false,
      error: { message, code, details },
    },
  });
  return error;
}

describe('StatusActions', () => {
  const onStatusChanged = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validation logic (client-side transition rules)', () => {
    it('offers only valid next statuses for an OPEN ticket', () => {
      render(
        <StatusActions
          ticketId="ticket-1"
          currentStatus="OPEN"
          onStatusChanged={onStatusChanged}
        />,
      );

      expect(screen.getByRole('button', { name: /move to in progress/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /move to cancelled/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /move to resolved/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /move to closed/i })).not.toBeInTheDocument();
    });

    it('renders one button per valid next status from getNextStatuses', () => {
      const cases: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
      for (const status of cases) {
        const next = getNextStatuses(status);
        const { unmount } = render(
          <StatusActions
            ticketId="ticket-1"
            currentStatus={status}
            onStatusChanged={onStatusChanged}
          />,
        );

        expect(screen.getAllByRole('button', { name: /move to/i })).toHaveLength(
          next.length,
        );
        for (const target of next) {
          expect(
            screen.getByRole('button', { name: `Move to ${STATUS_LABELS[target]}` }),
          ).toBeInTheDocument();
        }
        unmount();
      }
    });

    it('shows a terminal-state message instead of action buttons when no transitions exist', () => {
      render(
        <StatusActions
          ticketId="ticket-1"
          currentStatus="CLOSED"
          onStatusChanged={onStatusChanged}
        />,
      );

      expect(screen.getByText(/terminal state/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /move to/i })).not.toBeInTheDocument();
    });
  });

  describe('valid submission', () => {
    it('calls the API and refreshes the ticket on a valid transition', async () => {
      const user = userEvent.setup();
      vi.mocked(updateTicketStatus).mockResolvedValue({
        ...mockTicket,
        status: 'IN_PROGRESS',
      });

      render(
        <StatusActions
          ticketId="ticket-1"
          currentStatus="OPEN"
          onStatusChanged={onStatusChanged}
        />,
      );

      await user.click(screen.getByRole('button', { name: /move to in progress/i }));

      await waitFor(() => {
        expect(updateTicketStatus).toHaveBeenCalledWith('ticket-1', 'IN_PROGRESS');
        expect(onStatusChanged).toHaveBeenCalledOnce();
      });
    });
  });

  describe('invalid state transition', () => {
    it('surfaces a 409 state-machine error from the API', async () => {
      const user = userEvent.setup();
      vi.mocked(updateTicketStatus).mockRejectedValue(
        createApiError(
          409,
          'Invalid status transition from OPEN to RESOLVED',
          'INVALID_STATUS_TRANSITION',
        ),
      );

      render(
        <StatusActions
          ticketId="ticket-1"
          currentStatus="OPEN"
          onStatusChanged={onStatusChanged}
        />,
      );

      await user.click(screen.getByRole('button', { name: /move to in progress/i }));

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Invalid status transition from OPEN to RESOLVED',
      );
      expect(onStatusChanged).not.toHaveBeenCalled();
    });
  });

  describe('required-field / validation errors from API', () => {
    it('displays field-level validation messages when the API rejects the request', async () => {
      const user = userEvent.setup();
      vi.mocked(updateTicketStatus).mockRejectedValue(
        createApiError(400, 'Validation failed', 'VALIDATION_ERROR', [
          { field: 'status', message: 'Status is required' },
        ]),
      );

      render(
        <StatusActions
          ticketId="ticket-1"
          currentStatus="OPEN"
          onStatusChanged={onStatusChanged}
        />,
      );

      await user.click(screen.getByRole('button', { name: /move to in progress/i }));

      expect(await screen.findByRole('alert')).toHaveTextContent('Validation failed');
      expect(onStatusChanged).not.toHaveBeenCalled();
    });
  });
});

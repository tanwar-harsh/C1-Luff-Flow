import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TicketService } from '../services/TicketService';
import { UserService } from '../services/UserService';
import { ITicketRepository } from '../repositories/interfaces/ITicketRepository';
import {
  InvalidStatusTransitionError,
  NotFoundError,
  ValidationError,
} from '../utils/AppError';
import { Ticket, TicketWithRelations, User } from '../types/domain';

const now = new Date('2026-07-15T12:00:00.000Z');

const mockUser: User = {
  id: 'user-1',
  name: 'Jane Agent',
  email: 'agent@example.com',
  role: 'AGENT',
  createdAt: now,
  updatedAt: now,
};

const mockTicket: Ticket = {
  id: 'ticket-1',
  title: 'Payment failed',
  description: 'Customer charged twice.',
  priority: 'HIGH',
  status: 'OPEN',
  assignedToId: 'user-1',
  createdById: 'user-2',
  createdAt: now,
  updatedAt: now,
};

const mockTicketWithRelations: TicketWithRelations = {
  ...mockTicket,
  assignedTo: {
    id: 'user-1',
    name: 'Jane Agent',
    email: 'agent@example.com',
    role: 'AGENT',
  },
  createdBy: {
    id: 'user-2',
    name: 'Bob User',
    email: 'user@example.com',
    role: 'USER',
  },
  comments: [],
};

function createMockTicketRepository(): ITicketRepository {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByIdWithRelations: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    search: vi.fn(),
  };
}

function createMockUserService(): Pick<UserService, 'ensureUserExists'> {
  return {
    ensureUserExists: vi.fn().mockResolvedValue(mockUser),
  };
}

describe('TicketService', () => {
  let ticketRepository: ITicketRepository;
  let userService: Pick<UserService, 'ensureUserExists'>;
  let ticketService: TicketService;

  beforeEach(() => {
    ticketRepository = createMockTicketRepository();
    userService = createMockUserService();
    ticketService = new TicketService(
      ticketRepository,
      userService as UserService,
    );
    vi.clearAllMocks();
  });

  describe('createTicket', () => {
    it('validates createdBy and creates a ticket via the repository', async () => {
      vi.mocked(ticketRepository.create).mockResolvedValue(mockTicket);

      const result = await ticketService.createTicket({
        title: 'Payment failed',
        description: 'Customer charged twice.',
        priority: 'HIGH',
        createdBy: 'user-2',
        assignedTo: 'user-1',
      });

      expect(userService.ensureUserExists).toHaveBeenCalledWith('user-2', 'createdBy');
      expect(userService.ensureUserExists).toHaveBeenCalledWith('user-1', 'assignedTo');
      expect(ticketRepository.create).toHaveBeenCalledWith({
        title: 'Payment failed',
        description: 'Customer charged twice.',
        priority: 'HIGH',
        createdById: 'user-2',
        assignedToId: 'user-1',
      });
      expect(result).toEqual(mockTicket);
    });

    it('creates an unassigned ticket when assignedTo is omitted', async () => {
      vi.mocked(ticketRepository.create).mockResolvedValue({
        ...mockTicket,
        assignedToId: null,
      });

      await ticketService.createTicket({
        title: 'Login issue',
        description: 'Blank screen on mobile.',
        priority: 'MEDIUM',
        createdBy: 'user-2',
      });

      expect(userService.ensureUserExists).toHaveBeenCalledTimes(1);
      expect(userService.ensureUserExists).toHaveBeenCalledWith('user-2', 'createdBy');
      expect(ticketRepository.create).toHaveBeenCalledWith({
        title: 'Login issue',
        description: 'Blank screen on mobile.',
        priority: 'MEDIUM',
        createdById: 'user-2',
        assignedToId: null,
      });
    });

    it('propagates ValidationError when createdBy does not exist', async () => {
      vi.mocked(userService.ensureUserExists).mockRejectedValueOnce(
        new ValidationError('Validation failed', [
          { field: 'createdBy', message: 'User not found' },
        ]),
      );

      await expect(
        ticketService.createTicket({
          title: 'Test',
          description: 'Test',
          priority: 'LOW',
          createdBy: 'missing-user',
        }),
      ).rejects.toThrow(ValidationError);

      expect(ticketRepository.create).not.toHaveBeenCalled();
    });

    it('propagates ValidationError when assignedTo does not exist', async () => {
      vi.mocked(userService.ensureUserExists)
        .mockResolvedValueOnce(mockUser)
        .mockRejectedValueOnce(
          new ValidationError('Validation failed', [
            { field: 'assignedTo', message: 'User not found' },
          ]),
        );

      await expect(
        ticketService.createTicket({
          title: 'Test',
          description: 'Test',
          priority: 'LOW',
          createdBy: 'user-2',
          assignedTo: 'missing-agent',
        }),
      ).rejects.toThrow(ValidationError);

      expect(ticketRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('listTickets', () => {
    it('returns all tickets from the repository', async () => {
      vi.mocked(ticketRepository.findAll).mockResolvedValue([mockTicket]);

      const result = await ticketService.listTickets();

      expect(ticketRepository.findAll).toHaveBeenCalledOnce();
      expect(result).toEqual([mockTicket]);
    });
  });

  describe('getTicketById', () => {
    it('returns the ticket with relations when found', async () => {
      vi.mocked(ticketRepository.findByIdWithRelations).mockResolvedValue(
        mockTicketWithRelations,
      );

      const result = await ticketService.getTicketById('ticket-1');

      expect(ticketRepository.findByIdWithRelations).toHaveBeenCalledWith('ticket-1');
      expect(result).toEqual(mockTicketWithRelations);
    });

    it('throws NotFoundError when the ticket does not exist', async () => {
      vi.mocked(ticketRepository.findByIdWithRelations).mockResolvedValue(null);

      await expect(ticketService.getTicketById('missing')).rejects.toThrow(
        NotFoundError,
      );
      await expect(ticketService.getTicketById('missing')).rejects.toThrow(
        'Ticket not found',
      );
    });
  });

  describe('updateTicket', () => {
    it('updates only the fields provided', async () => {
      vi.mocked(ticketRepository.findById).mockResolvedValue(mockTicket);
      vi.mocked(ticketRepository.update).mockResolvedValue({
        ...mockTicket,
        title: 'Updated title',
        priority: 'CRITICAL',
      });

      const result = await ticketService.updateTicket('ticket-1', {
        title: 'Updated title',
        priority: 'CRITICAL',
      });

      expect(ticketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(userService.ensureUserExists).not.toHaveBeenCalled();
      expect(ticketRepository.update).toHaveBeenCalledWith('ticket-1', {
        title: 'Updated title',
        priority: 'CRITICAL',
      });
      expect(result.title).toBe('Updated title');
    });

    it('validates assignedTo before updating assignment', async () => {
      vi.mocked(ticketRepository.findById).mockResolvedValue(mockTicket);
      vi.mocked(ticketRepository.update).mockResolvedValue(mockTicket);

      await ticketService.updateTicket('ticket-1', { assignedTo: 'user-3' });

      expect(userService.ensureUserExists).toHaveBeenCalledWith('user-3', 'assignedTo');
      expect(ticketRepository.update).toHaveBeenCalledWith('ticket-1', {
        assignedToId: 'user-3',
      });
    });

    it('allows unassigning by setting assignedTo to null', async () => {
      vi.mocked(ticketRepository.findById).mockResolvedValue(mockTicket);
      vi.mocked(ticketRepository.update).mockResolvedValue({
        ...mockTicket,
        assignedToId: null,
      });

      await ticketService.updateTicket('ticket-1', { assignedTo: null });

      expect(userService.ensureUserExists).not.toHaveBeenCalled();
      expect(ticketRepository.update).toHaveBeenCalledWith('ticket-1', {
        assignedToId: null,
      });
    });

    it('throws NotFoundError when the ticket does not exist', async () => {
      vi.mocked(ticketRepository.findById).mockResolvedValue(null);

      await expect(
        ticketService.updateTicket('missing', { title: 'Nope' }),
      ).rejects.toThrow(NotFoundError);

      expect(ticketRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('updateTicketStatus', () => {
    it('validates the transition and updates status via the repository', async () => {
      vi.mocked(ticketRepository.findById).mockResolvedValue(mockTicket);
      vi.mocked(ticketRepository.updateStatus).mockResolvedValue({
        ...mockTicket,
        status: 'IN_PROGRESS',
      });

      const result = await ticketService.updateTicketStatus('ticket-1', 'IN_PROGRESS');

      expect(ticketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(ticketRepository.updateStatus).toHaveBeenCalledWith(
        'ticket-1',
        'IN_PROGRESS',
      );
      expect(result.status).toBe('IN_PROGRESS');
    });

    it('throws NotFoundError when the ticket does not exist', async () => {
      vi.mocked(ticketRepository.findById).mockResolvedValue(null);

      await expect(
        ticketService.updateTicketStatus('missing', 'IN_PROGRESS'),
      ).rejects.toThrow(NotFoundError);

      expect(ticketRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('throws InvalidStatusTransitionError for invalid transitions', async () => {
      vi.mocked(ticketRepository.findById).mockResolvedValue(mockTicket);

      await expect(
        ticketService.updateTicketStatus('ticket-1', 'RESOLVED'),
      ).rejects.toThrow(InvalidStatusTransitionError);

      expect(ticketRepository.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('searchTickets', () => {
    it('delegates keyword and status filters to the repository', async () => {
      vi.mocked(ticketRepository.search).mockResolvedValue([mockTicket]);

      const result = await ticketService.searchTickets({
        q: 'payment',
        status: 'OPEN',
      });

      expect(ticketRepository.search).toHaveBeenCalledWith({
        q: 'payment',
        status: 'OPEN',
      });
      expect(result).toEqual([mockTicket]);
    });
  });
});

import {
  CreateTicketData,
  Ticket,
  TicketSearchParams,
  TicketStatus,
  TicketWithRelations,
  UpdateTicketData,
} from '../types/domain';
import { ITicketRepository } from '../repositories/interfaces/ITicketRepository';
import { NotFoundError } from '../utils/AppError';
import { UserService } from './UserService';
import { validateStatusTransition } from './ticketStatusMachine';

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: CreateTicketData['priority'];
  createdBy: string;
  assignedTo?: string | null;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: CreateTicketData['priority'];
  assignedTo?: string | null;
}

export class TicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly userService: UserService,
  ) {}

  async createTicket(input: CreateTicketInput): Promise<Ticket> {
    await this.userService.ensureUserExists(input.createdBy, 'createdBy');

    if (input.assignedTo) {
      await this.userService.ensureUserExists(input.assignedTo, 'assignedTo');
    }

    return this.ticketRepository.create({
      title: input.title,
      description: input.description,
      priority: input.priority,
      createdById: input.createdBy,
      assignedToId: input.assignedTo ?? null,
    });
  }

  async listTickets(): Promise<Ticket[]> {
    return this.ticketRepository.findAll();
  }

  async getTicketById(id: string): Promise<TicketWithRelations> {
    const ticket = await this.ticketRepository.findByIdWithRelations(id);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }
    return ticket;
  }

  async updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
    const existing = await this.ticketRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Ticket not found');
    }

    if (input.assignedTo) {
      await this.userService.ensureUserExists(input.assignedTo, 'assignedTo');
    }

    const updateData: UpdateTicketData = {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.assignedTo !== undefined ? { assignedToId: input.assignedTo } : {}),
    };

    return this.ticketRepository.update(id, updateData);
  }

  async updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    validateStatusTransition(ticket.status, status);

    return this.ticketRepository.updateStatus(id, status);
  }

  async searchTickets(params: TicketSearchParams): Promise<Ticket[]> {
    return this.ticketRepository.search(params);
  }
}

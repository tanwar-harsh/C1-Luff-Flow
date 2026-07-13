import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateTicketData,
  Ticket,
  TicketSearchParams,
  TicketStatus,
  TicketWithRelations,
  UpdateTicketData,
} from '../types/domain';
import { ITicketRepository } from './interfaces/ITicketRepository';

const userSummarySelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export class TicketRepository implements ITicketRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTicketData): Promise<Ticket> {
    return this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        createdById: data.createdById,
        assignedToId: data.assignedToId ?? null,
      },
    });
  }

  async findAll(): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({
      where: { id },
    });
  }

  async findByIdWithRelations(id: string): Promise<TicketWithRelations | null> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        assignedTo: { select: userSummarySelect },
        createdBy: { select: userSummarySelect },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            createdBy: { select: userSummarySelect },
          },
        },
      },
    });

    return ticket;
  }

  async update(id: string, data: UpdateTicketData): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.assignedToId !== undefined ? { assignedToId: data.assignedToId } : {}),
      },
    });
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { id },
      data: { status },
    });
  }

  async search(params: TicketSearchParams): Promise<Ticket[]> {
    const where: Prisma.TicketWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}

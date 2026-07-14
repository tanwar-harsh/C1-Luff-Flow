import { PrismaClient } from '@prisma/client';
import { User } from '../types/domain';
import {
  CreateUserData,
  IUserRepository,
  PaginationParams,
  PaginatedUsers,
  UpdateUserData,
  UserWithPassword,
} from './interfaces/IUserRepository';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: { name: 'asc' },
    });
  }

  async findManyPaginated(params: PaginationParams): Promise<PaginatedUsers> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        select: userSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  }

  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, passwordHash: true },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? 'USER',
      },
      select: userSelect,
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async countRelatedRecords(id: string): Promise<number> {
    const [createdTickets, assignedTickets, comments] = await Promise.all([
      this.prisma.ticket.count({ where: { createdById: id } }),
      this.prisma.ticket.count({ where: { assignedToId: id } }),
      this.prisma.comment.count({ where: { createdById: id } }),
    ]);
    return createdTickets + assignedTickets + comments;
  }
}

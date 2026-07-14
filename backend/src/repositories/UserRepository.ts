import { PrismaClient } from '@prisma/client';
import { User } from '../types/domain';
import {
  CreateUserData,
  IUserRepository,
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
}

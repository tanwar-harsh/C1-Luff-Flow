import { PrismaClient, Role, Priority, TicketStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { hashPassword } from '../../utils/password';

export const TEST_PASSWORD = 'Password123!';

export async function resetDatabase(): Promise<void> {
  await prisma.refreshToken.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}

export interface TestUsers {
  admin: { id: string; email: string };
  agent: { id: string; email: string };
  user: { id: string; email: string };
}

export async function seedTestUsers(): Promise<TestUsers> {
  const passwordHash = await hashPassword(TEST_PASSWORD);

  const admin = await prisma.user.create({
    data: {
      name: 'Test Admin',
      email: 'test-admin@example.com',
      role: Role.ADMIN,
      passwordHash,
    },
  });
  const agent = await prisma.user.create({
    data: {
      name: 'Test Agent',
      email: 'test-agent@example.com',
      role: Role.AGENT,
      passwordHash,
    },
  });
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test-user@example.com',
      role: Role.USER,
      passwordHash,
    },
  });

  return { admin, agent, user };
}

export async function createTicketFixture(
  client: PrismaClient,
  overrides: {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: TicketStatus;
    createdById: string;
    assignedToId?: string | null;
  },
) {
  return client.ticket.create({
    data: {
      title: overrides.title ?? 'Test ticket title',
      description: overrides.description ?? 'Test ticket description for integration tests',
      priority: overrides.priority ?? Priority.MEDIUM,
      status: overrides.status ?? TicketStatus.OPEN,
      createdById: overrides.createdById,
      assignedToId: overrides.assignedToId ?? null,
    },
  });
}

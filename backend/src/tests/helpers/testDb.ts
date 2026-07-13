import { PrismaClient, Role, Priority, TicketStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export async function resetDatabase(): Promise<void> {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}

export interface TestUsers {
  admin: { id: string };
  agent: { id: string };
  user: { id: string };
}

export async function seedTestUsers(): Promise<TestUsers> {
  const admin = await prisma.user.create({
    data: { name: 'Test Admin', email: 'test-admin@example.com', role: Role.ADMIN },
  });
  const agent = await prisma.user.create({
    data: { name: 'Test Agent', email: 'test-agent@example.com', role: Role.AGENT },
  });
  const user = await prisma.user.create({
    data: { name: 'Test User', email: 'test-user@example.com', role: Role.USER },
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

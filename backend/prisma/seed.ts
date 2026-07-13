import { PrismaClient, Priority, Role, TicketStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Alice Admin',
      email: 'admin@example.com',
      role: Role.ADMIN,
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: 'Jane Agent',
      email: 'agent@example.com',
      role: Role.AGENT,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Bob User',
      email: 'user@example.com',
      role: Role.USER,
    },
  });

  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        title: 'Payment failed on checkout',
        description: 'Customer was charged twice during payment for order #1234.',
        priority: Priority.HIGH,
        status: TicketStatus.OPEN,
        createdById: user.id,
        assignedToId: agent.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: 'Login page not loading',
        description: 'Users report a blank screen when accessing the login page on mobile.',
        priority: Priority.CRITICAL,
        status: TicketStatus.IN_PROGRESS,
        createdById: user.id,
        assignedToId: agent.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: 'Request for invoice copy',
        description: 'Customer needs a duplicate invoice for order #5678 for expense reporting.',
        priority: Priority.LOW,
        status: TicketStatus.RESOLVED,
        createdById: user.id,
        assignedToId: agent.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: 'Password reset email delayed',
        description: 'Password reset emails are taking over 30 minutes to arrive.',
        priority: Priority.MEDIUM,
        status: TicketStatus.CLOSED,
        createdById: user.id,
        assignedToId: agent.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: 'Feature request: dark mode',
        description: 'User requested dark mode support for the dashboard.',
        priority: Priority.LOW,
        status: TicketStatus.CANCELLED,
        createdById: user.id,
      },
    }),
  ]);

  await prisma.comment.createMany({
    data: [
      {
        ticketId: tickets[0].id,
        message: 'Investigating payment gateway logs for duplicate charge.',
        createdById: agent.id,
      },
      {
        ticketId: tickets[0].id,
        message: 'Customer confirmed charge appeared twice on bank statement.',
        createdById: user.id,
      },
      {
        ticketId: tickets[1].id,
        message: 'Reproduced on iOS Safari. Checking recent CSS deploy.',
        createdById: agent.id,
      },
    ],
  });

  console.log('Seed completed:');
  console.log(`  Users: 3 (admin, agent, user)`);
  console.log(`  Tickets: ${tickets.length}`);
  console.log(`  Comments: 3`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

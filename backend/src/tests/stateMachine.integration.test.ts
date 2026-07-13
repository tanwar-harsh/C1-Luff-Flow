import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { TicketStatus } from '@prisma/client';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import {
  resetDatabase,
  seedTestUsers,
  createTicketFixture,
  TestUsers,
} from './helpers/testDb';
import { isDatabaseAvailable } from './helpers/dbCheck';

const app = createApp();
const dbAvailable = await isDatabaseAvailable();

describe.skipIf(!dbAvailable)('Ticket Status State Machine (Integration)', () => {
  let users: TestUsers;

  beforeAll(async () => {
    await resetDatabase();
    users = await seedTestUsers();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  async function createOpenTicket() {
    const response = await request(app)
      .post('/api/tickets')
      .send({
        title: 'State machine test ticket',
        description: 'Ticket used for state machine integration tests',
        priority: 'MEDIUM',
        createdBy: users.user.id,
        assignedTo: users.agent.id,
      });
    expect(response.status).toBe(201);
    return response.body.data;
  }

  async function patchStatus(ticketId: string, status: string) {
    return request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status });
  }

  // Mandatory pass cases
  it('PASS: Open → In Progress', async () => {
    const ticket = await createOpenTicket();
    const response = await patchStatus(ticket.id, 'IN_PROGRESS');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('IN_PROGRESS');
  });

  it('PASS: In Progress → Resolved', async () => {
    const ticket = await createOpenTicket();
    await patchStatus(ticket.id, 'IN_PROGRESS');
    const response = await patchStatus(ticket.id, 'RESOLVED');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('RESOLVED');
  });

  it('PASS: Resolved → Closed', async () => {
    const ticket = await createOpenTicket();
    await patchStatus(ticket.id, 'IN_PROGRESS');
    await patchStatus(ticket.id, 'RESOLVED');
    const response = await patchStatus(ticket.id, 'CLOSED');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('CLOSED');
  });

  it('PASS: Open → Cancelled', async () => {
    const ticket = await createOpenTicket();
    const response = await patchStatus(ticket.id, 'CANCELLED');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('CANCELLED');
  });

  it('PASS: In Progress → Cancelled', async () => {
    const ticket = await createOpenTicket();
    await patchStatus(ticket.id, 'IN_PROGRESS');
    const response = await patchStatus(ticket.id, 'CANCELLED');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('CANCELLED');
  });

  // Mandatory fail cases
  it('FAIL: Open → Resolved (409)', async () => {
    const ticket = await createOpenTicket();
    const response = await patchStatus(ticket.id, 'RESOLVED');
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    expect(response.body.error.message).toBe(
      'Invalid status transition from OPEN to RESOLVED',
    );
  });

  it('FAIL: Resolved → Open (409)', async () => {
    const ticket = await createTicketFixture(prisma, {
      createdById: users.user.id,
      status: TicketStatus.RESOLVED,
    });
    const response = await patchStatus(ticket.id, 'OPEN');
    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe(
      'Invalid status transition from RESOLVED to OPEN',
    );
  });

  it('FAIL: Closed → Open (409)', async () => {
    const ticket = await createTicketFixture(prisma, {
      createdById: users.user.id,
      status: TicketStatus.CLOSED,
    });
    const response = await patchStatus(ticket.id, 'OPEN');
    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe(
      'Invalid status transition from CLOSED to OPEN',
    );
  });
});

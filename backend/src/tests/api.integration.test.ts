import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { resetDatabase, seedTestUsers, TestUsers } from './helpers/testDb';
import { isDatabaseAvailable } from './helpers/dbCheck';

const app = createApp();
const dbAvailable = await isDatabaseAvailable();

describe.skipIf(!dbAvailable)('Users API (Integration)', () => {
  beforeAll(async () => {
    await resetDatabase();
    await seedTestUsers();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('GET /api/users requires admin authentication', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(401);
  });
});

describe.skipIf(!dbAvailable)('Comments API (Integration)', () => {
  let users: TestUsers;

  beforeAll(async () => {
    await resetDatabase();
    users = await seedTestUsers();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('POST /api/tickets/:id/comments adds a comment', async () => {
    const ticket = await request(app)
      .post('/api/tickets')
      .send({
        title: 'Comment test ticket',
        description: 'Ticket for comment integration test',
        priority: 'MEDIUM',
        createdBy: users.user.id,
      });

    const response = await request(app)
      .post(`/api/tickets/${ticket.body.data.id}/comments`)
      .send({
        message: 'Contacted customer, awaiting response',
        createdBy: users.agent.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.message).toBe('Contacted customer, awaiting response');
    expect(response.body.data.ticketId).toBe(ticket.body.data.id);
  });

  it('returns 404 when ticket does not exist', async () => {
    const response = await request(app)
      .post('/api/tickets/nonexistent-id/comments')
      .send({
        message: 'This should fail',
        createdBy: users.agent.id,
      });

    expect(response.status).toBe(404);
  });
});

describe.skipIf(!dbAvailable)('Search API (Integration)', () => {
  let users: TestUsers;

  beforeAll(async () => {
    await resetDatabase();
    users = await seedTestUsers();

    await request(app)
      .post('/api/tickets')
      .send({
        title: 'Payment gateway error',
        description: 'Payment processing failed during checkout',
        priority: 'HIGH',
        createdBy: users.user.id,
      });

    await request(app)
      .post('/api/tickets')
      .send({
        title: 'Login issue',
        description: 'User cannot access login page on mobile',
        priority: 'LOW',
        createdBy: users.user.id,
      });
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('GET /api/tickets/search?q=payment finds matching tickets', async () => {
    const response = await request(app).get('/api/tickets/search').query({ q: 'payment' });
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].title.toLowerCase()).toContain('payment');
  });

  it('GET /api/tickets/search?status=OPEN filters by status', async () => {
    const response = await request(app)
      .get('/api/tickets/search')
      .query({ status: 'OPEN' });
    expect(response.status).toBe(200);
    expect(response.body.data.every((t: { status: string }) => t.status === 'OPEN')).toBe(true);
  });

  it('GET /api/tickets/search?q=payment&status=OPEN combines filters', async () => {
    const response = await request(app)
      .get('/api/tickets/search')
      .query({ q: 'payment', status: 'OPEN' });
    expect(response.status).toBe(200);
    for (const ticket of response.body.data) {
      expect(ticket.status).toBe('OPEN');
    }
  });
});

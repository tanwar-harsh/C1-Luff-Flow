import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { resetDatabase, seedTestUsers, TestUsers } from './helpers/testDb';
import { isDatabaseAvailable } from './helpers/dbCheck';
import { loginAsAgent, loginAsUser, withCookies } from './helpers/auth';

const app = createApp();
const dbAvailable = await isDatabaseAvailable();

describe.skipIf(!dbAvailable)('Tickets API (Integration)', () => {
  let users: TestUsers;
  let agentCookies: string[];
  let userCookies: string[];

  beforeAll(async () => {
    await resetDatabase();
    users = await seedTestUsers();
    agentCookies = await loginAsAgent(app);
    userCookies = await loginAsUser(app);
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  describe('POST /api/tickets', () => {
    it('creates a ticket with OPEN status as AGENT', async () => {
      const response = await withCookies(app, agentCookies)
        .post('/api/tickets')
        .send({
          title: 'Payment failed',
          description: 'Customer charged twice for order #1234',
          priority: 'HIGH',
          assignedTo: users.agent.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('OPEN');
      expect(response.body.data.title).toBe('Payment failed');
      expect(response.body.data.createdById).toBe(users.agent.id);
    });

    it('returns 403 when USER tries to create a ticket', async () => {
      const response = await withCookies(app, userCookies)
        .post('/api/tickets')
        .send({
          title: 'User ticket attempt',
          description: 'Regular user should not create tickets',
          priority: 'LOW',
        });

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    it('returns 401 when unauthenticated', async () => {
      const response = await request(app).post('/api/tickets').send({
        title: 'Unauthenticated ticket',
        description: 'Should require authentication',
        priority: 'LOW',
      });

      expect(response.status).toBe(401);
    });

    it('returns 400 for invalid title', async () => {
      const response = await withCookies(app, agentCookies)
        .post('/api/tickets')
        .send({
          title: 'ab',
          description: 'Description long enough here',
          priority: 'HIGH',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title' }),
        ]),
      );
    });
  });

  describe('GET /api/tickets', () => {
    it('lists tickets newest first for authenticated USER', async () => {
      const response = await withCookies(app, userCookies).get('/api/tickets');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('returns 401 when unauthenticated', async () => {
      const response = await request(app).get('/api/tickets');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('returns ticket with relations', async () => {
      const created = await withCookies(app, agentCookies)
        .post('/api/tickets')
        .send({
          title: 'Detail view ticket',
          description: 'Ticket for detail view integration test',
          priority: 'LOW',
        });

      const response = await withCookies(app, userCookies).get(
        `/api/tickets/${created.body.data.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.data.createdBy).toMatchObject({ id: users.agent.id });
      expect(response.body.data.comments).toEqual([]);
    });

    it('returns 404 for unknown ticket', async () => {
      const response = await withCookies(app, userCookies).get('/api/tickets/unknown-id');
      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/tickets/:id', () => {
    it('updates ticket fields without changing status', async () => {
      const created = await withCookies(app, agentCookies)
        .post('/api/tickets')
        .send({
          title: 'Original title',
          description: 'Original description for update test',
          priority: 'LOW',
        });

      const ticketId = created.body.data.id;
      const response = await withCookies(app, agentCookies)
        .put(`/api/tickets/${ticketId}`)
        .send({
          title: 'Updated title',
          assignedTo: users.agent.id,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated title');
      expect(response.body.data.assignedToId).toBe(users.agent.id);
      expect(response.body.data.status).toBe('OPEN');
    });

    it('returns 403 when USER tries to update', async () => {
      const created = await withCookies(app, agentCookies)
        .post('/api/tickets')
        .send({
          title: 'Update guard ticket',
          description: 'Ticket for USER update guard test',
          priority: 'LOW',
        });

      const response = await withCookies(app, userCookies)
        .put(`/api/tickets/${created.body.data.id}`)
        .send({ title: 'Hacked title' });

      expect(response.status).toBe(403);
    });
  });
});

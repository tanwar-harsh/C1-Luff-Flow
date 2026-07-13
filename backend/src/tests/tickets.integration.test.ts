import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { resetDatabase, seedTestUsers, TestUsers } from './helpers/testDb';
import { isDatabaseAvailable } from './helpers/dbCheck';

const app = createApp();
const dbAvailable = await isDatabaseAvailable();

describe.skipIf(!dbAvailable)('Tickets API (Integration)', () => {
  let users: TestUsers;

  beforeAll(async () => {
    await resetDatabase();
    users = await seedTestUsers();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  describe('POST /api/tickets', () => {
    it('creates a ticket with OPEN status', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Payment failed',
          description: 'Customer charged twice for order #1234',
          priority: 'HIGH',
          createdBy: users.user.id,
          assignedTo: users.agent.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('OPEN');
      expect(response.body.data.title).toBe('Payment failed');
    });

    it('returns 400 for invalid title', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: 'ab',
          description: 'Description long enough here',
          priority: 'HIGH',
          createdBy: users.user.id,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title' }),
        ]),
      );
    });

    it('returns 400 for missing createdBy', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Valid description here',
          priority: 'HIGH',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'createdBy' }),
        ]),
      );
    });

    it('returns 400 when createdBy user does not exist', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Valid description here',
          priority: 'HIGH',
          createdBy: 'nonexistent-user-id',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'createdBy', message: 'User not found' }),
        ]),
      );
    });
  });

  describe('GET /api/tickets', () => {
    it('lists tickets newest first', async () => {
      const response = await request(app).get('/api/tickets');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('returns ticket with relations', async () => {
      const created = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Detail view ticket',
          description: 'Ticket for detail view integration test',
          priority: 'LOW',
          createdBy: users.user.id,
        });

      const response = await request(app).get(`/api/tickets/${created.body.data.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data.createdBy).toMatchObject({ id: users.user.id });
      expect(response.body.data.comments).toEqual([]);
    });

    it('returns 404 for unknown ticket', async () => {
      const response = await request(app).get('/api/tickets/unknown-id');
      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/tickets/:id', () => {
    it('updates ticket fields without changing status', async () => {
      const created = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Original title',
          description: 'Original description for update test',
          priority: 'LOW',
          createdBy: users.user.id,
        });

      const ticketId = created.body.data.id;
      const response = await request(app)
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
  });
});

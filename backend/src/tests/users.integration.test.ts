import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { resetDatabase, seedTestUsers, TEST_PASSWORD } from './helpers/testDb';
import { isDatabaseAvailable } from './helpers/dbCheck';
import { loginAs } from './helpers/auth';

const app = createApp();
const dbAvailable = await isDatabaseAvailable();

describe.skipIf(!dbAvailable)('Users CRUD API (Integration)', () => {
  let adminCookies: string[];
  let agentCookies: string[];
  let users: Awaited<ReturnType<typeof seedTestUsers>>;

  beforeAll(async () => {
    await resetDatabase();
    users = await seedTestUsers();
    adminCookies = await loginAs(app, users.admin.email, TEST_PASSWORD);
    agentCookies = await loginAs(app, users.agent.email, TEST_PASSWORD);
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('GET /api/users returns paginated users for admin', async () => {
    const response = await request(app)
      .get('/api/users?page=1&limit=10')
      .set('Cookie', adminCookies);

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(3);
    expect(response.body.data.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
    });
  });

  it('GET /api/users returns 403 for non-admin', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Cookie', agentCookies);

    expect(response.status).toBe(403);
  });

  it('GET /api/users returns 401 without auth', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(401);
  });

  it('GET /api/users/:id returns a user for admin', async () => {
    const response = await request(app)
      .get(`/api/users/${users.user.id}`)
      .set('Cookie', adminCookies);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('test-user@example.com');
  });

  it('POST /api/users creates a user', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', adminCookies)
      .send({
        name: 'New Staff',
        email: 'newstaff@example.com',
        password: 'securepass1',
        role: 'AGENT',
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      name: 'New Staff',
      email: 'newstaff@example.com',
      role: 'AGENT',
    });
  });

  it('PATCH /api/users/:id updates a user', async () => {
    const create = await request(app)
      .post('/api/users')
      .set('Cookie', adminCookies)
      .send({
        name: 'Patch Target',
        email: 'patch@example.com',
        password: 'securepass1',
        role: 'USER',
      });

    const response = await request(app)
      .patch(`/api/users/${create.body.data.id}`)
      .set('Cookie', adminCookies)
      .send({ name: 'Patched Name', role: 'AGENT' });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Patched Name');
    expect(response.body.data.role).toBe('AGENT');
  });

  it('PATCH /api/users/me updates own profile', async () => {
    const response = await request(app)
      .patch('/api/users/me')
      .set('Cookie', agentCookies)
      .send({ name: 'Updated Agent Name' });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Updated Agent Name');
    expect(response.body.data.role).toBe('AGENT');
  });

  it('DELETE /api/users/:id deletes user without related records', async () => {
    const create = await request(app)
      .post('/api/users')
      .set('Cookie', adminCookies)
      .send({
        name: 'Delete Me',
        email: 'delete@example.com',
        password: 'securepass1',
        role: 'USER',
      });

    const response = await request(app)
      .delete(`/api/users/${create.body.data.id}`)
      .set('Cookie', adminCookies);

    expect(response.status).toBe(200);
  });

  it('DELETE /api/users/:id rejects user with tickets', async () => {
    await prisma.ticket.create({
      data: {
        title: 'User delete guard ticket',
        description: 'Ticket to block user deletion in integration test',
        priority: 'MEDIUM',
        createdById: users.user.id,
      },
    });

    const response = await request(app)
      .delete(`/api/users/${users.user.id}`)
      .set('Cookie', adminCookies);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/users/assignees returns list for agents', async () => {
    const response = await request(app)
      .get('/api/users/assignees')
      .set('Cookie', agentCookies);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThanOrEqual(3);
  });
});

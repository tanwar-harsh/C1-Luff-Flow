import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { resetDatabase, TEST_PASSWORD } from './helpers/testDb';
import { isDatabaseAvailable } from './helpers/dbCheck';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../utils/cookies';

const app = createApp();
const dbAvailable = await isDatabaseAvailable();

describe.skipIf(!dbAvailable)('Auth API (Integration)', () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('POST /api/auth/register creates a user and sets auth cookies', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'securepass1',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toMatchObject({
      name: 'New User',
      email: 'newuser@example.com',
      role: 'USER',
    });
    expect(response.headers['set-cookie']).toBeDefined();
    const cookies = response.headers['set-cookie'] as unknown as string[];
    expect(cookies.some((c) => c.startsWith(`${ACCESS_TOKEN_COOKIE}=`))).toBe(true);
    expect(cookies.some((c) => c.startsWith(`${REFRESH_TOKEN_COOKIE}=`))).toBe(true);
  });

  it('POST /api/auth/register rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Dup User',
      email: 'dup@example.com',
      password: 'securepass1',
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Dup User 2',
      email: 'dup@example.com',
      password: 'securepass1',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/auth/login authenticates with valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'securepass1',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'securepass1',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe('login@example.com');
  });

  it('POST /api/auth/login rejects invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/auth/refresh issues new tokens', async () => {
    const login = await request(app).post('/api/auth/register').send({
      name: 'Refresh User',
      email: 'refresh@example.com',
      password: 'securepass1',
    });

    const cookies = login.headers['set-cookie'];
    const response = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookies);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('POST /api/auth/logout revokes session', async () => {
    const login = await request(app).post('/api/auth/register').send({
      name: 'Logout User',
      email: 'logout@example.com',
      password: 'securepass1',
    });

    const cookies = login.headers['set-cookie'];
    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookies);

    expect(logout.status).toBe(200);

    const refresh = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookies);

    expect(refresh.status).toBe(401);
  });

  it('GET /api/auth/me returns current user when authenticated', async () => {
    const login = await request(app).post('/api/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: TEST_PASSWORD,
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe('me@example.com');
  });

  it('GET /api/auth/me returns 401 without cookies', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });
});

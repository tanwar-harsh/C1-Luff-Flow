import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Router } from 'express';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { resetDatabase, seedTestUsers, TEST_PASSWORD } from './helpers/testDb';
import { isDatabaseAvailable } from './helpers/dbCheck';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { errorHandler } from '../middlewares/errorHandler';

const app = createApp();
const dbAvailable = await isDatabaseAvailable();

function createAuthorizeTestApp() {
  const testApp = express();
  testApp.use(cookieParser());
  const router = Router();
  router.get(
    '/admin',
    authenticate,
    authorize('ADMIN'),
    asyncHandler(async (_req, res) => {
      res.json(successResponse({ ok: true }));
    }),
  );
  testApp.use('/api/test', router);
  testApp.use(errorHandler);
  return testApp;
}

describe.skipIf(!dbAvailable)('authorize middleware (Integration)', () => {
  const testApp = createAuthorizeTestApp();

  beforeAll(async () => {
    await resetDatabase();
    await seedTestUsers();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('allows ADMIN role', async () => {
    const login = await request(app).post('/api/auth/login').send({
      email: 'test-admin@example.com',
      password: TEST_PASSWORD,
    });

    const response = await request(testApp)
      .get('/api/test/admin')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.status).toBe(200);
  });

  it('forbids USER role', async () => {
    const login = await request(app).post('/api/auth/login').send({
      email: 'test-user@example.com',
      password: TEST_PASSWORD,
    });

    const response = await request(testApp)
      .get('/api/test/admin')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });
});

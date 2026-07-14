import request from 'supertest';
import { Express } from 'express';
import { TEST_PASSWORD } from './testDb';

export async function loginAs(
  app: Express,
  email: string,
  password: string,
): Promise<string[]> {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.headers['set-cookie'] as string[];
}

export async function loginAsAdmin(app: Express): Promise<string[]> {
  return loginAs(app, 'test-admin@example.com', TEST_PASSWORD);
}

export async function loginAsAgent(app: Express): Promise<string[]> {
  return loginAs(app, 'test-agent@example.com', TEST_PASSWORD);
}

export async function loginAsUser(app: Express): Promise<string[]> {
  return loginAs(app, 'test-user@example.com', TEST_PASSWORD);
}

export function withCookies(app: Express, cookies: string[]) {
  return {
    get: (path: string) => request(app).get(path).set('Cookie', cookies),
    post: (path: string) => request(app).post(path).set('Cookie', cookies),
    put: (path: string) => request(app).put(path).set('Cookie', cookies),
    patch: (path: string) => request(app).patch(path).set('Cookie', cookies),
  };
}

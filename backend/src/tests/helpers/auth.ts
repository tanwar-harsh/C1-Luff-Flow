import request from 'supertest';
import { Express } from 'express';

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

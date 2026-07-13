import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

describe('GET /api/health', () => {
  const app = createApp();

  it('returns 200 with ok status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: 'ok',
        timestamp: expect.any(String),
      },
    });
  });
});

describe('Unknown routes', () => {
  const app = createApp();

  it('returns 404 for unknown API routes', async () => {
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});

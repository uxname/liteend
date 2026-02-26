import type { InjectOptions } from 'fastify';
import { beforeAll, describe, expect, it } from 'vitest';
import { E2EClient } from './utils/e2e-client';
import { createTestingApp } from './utils/testing-app';

describe('AppController (e2e)', () => {
  let client: E2EClient;

  beforeAll(async () => {
    const { fastify } = await createTestingApp();

    client = new E2EClient(fastify);
  });

  it('GET /health returns ok info when dependencies are healthy', async () => {
    const options: InjectOptions = { method: 'GET', url: '/health' };

    const response = await client.request(options);
    const body = response.json();

    expect({
      statusCode: response.statusCode,
      status: body.status,
      databaseStatus: body.info.database.status,
      redisStatus: body.info.redis.status,
    }).toEqual({
      statusCode: 200,
      status: 'ok',
      databaseStatus: 'ok',
      redisStatus: 'ok',
    });
  });

  it('GET / returns 404', async () => {
    const response = await client.request({
      method: 'GET',
      url: '/',
    } as InjectOptions);

    expect(response.statusCode).toBe(404);
  });
});

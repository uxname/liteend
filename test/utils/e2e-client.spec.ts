import type { FastifyInstance, InjectOptions } from 'fastify';
import { describe, expect, it, vi } from 'vitest';
import { E2EClient } from './e2e-client';

type MockInjectResponse = {
  statusCode: number;
  headers: Record<string, string>;
  payload: string;
  json: () => unknown;
};

const createFastifyMock = (
  responseFactory: (
    options: InjectOptions,
  ) => Promise<MockInjectResponse> | MockInjectResponse,
) => {
  const inject = vi.fn((options: InjectOptions) =>
    Promise.resolve(responseFactory(options)),
  );
  return {
    inject,
  } as unknown as FastifyInstance;
};

describe('E2EClient', () => {
  it('should proxy request and expose helpers', async () => {
    const responseBody = { ok: true };
    const fastify = createFastifyMock(async () => ({
      statusCode: 201,
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify(responseBody),
      json: () => responseBody,
    }));

    const client = new E2EClient(fastify);
    const response = await client.request({ method: 'POST', url: '/health' });

    expect(response.statusCode).toBe(201);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.json()).toEqual(responseBody);
  });

  it('should send GraphQL request and read data payload', async () => {
    const graphResponse = { data: { echo: 'hello' }, errors: undefined };
    const fastify = createFastifyMock(async () => ({
      statusCode: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      payload: JSON.stringify(graphResponse),
      json: () => graphResponse,
    }));

    const client = new E2EClient(fastify);
    const result = await client.requestGraphQL<{ echo: string }>(
      'query { echo(text: "hello") }',
    );

    expect(result.statusCode).toBe(200);
    expect(result.data?.echo).toBe('hello');
    expect(result.errors).toBeUndefined();
  });

  it('should throw when GraphQL response is not JSON', async () => {
    const fastify = createFastifyMock(async () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/plain' },
      payload: 'not json',
      json: () => ({}),
    }));

    const client = new E2EClient(fastify);

    await expect(client.requestGraphQL('query { ping }')).rejects.toThrowError(
      'Expected JSON response',
    );
  });
});

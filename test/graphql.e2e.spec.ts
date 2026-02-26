import { beforeAll, describe, expect, it } from 'vitest';
import { E2EClient } from './utils/e2e-client';
import { getFastifyInstance } from './utils/testing-app';

describe('GraphQL (e2e)', () => {
  let client: E2EClient;

  beforeAll(() => {
    client = new E2EClient(getFastifyInstance());
  });

  describe('Schema basics', () => {
    it('should return __typename for introspection queries', async () => {
      const query = '{ __typename }';

      const response = await client.requestGraphQL<{ __typename: string }>(
        query,
      );

      expect(response.statusCode).toBe(200);
      expect(response.errors).toBeUndefined();
      expect(response.data?.__typename).toBe('Query');
    });
  });

  describe('Echo operations', () => {
    it('should echo text for queries', async () => {
      const query = 'query { echo(text: "hello world") }';

      const response = await client.requestGraphQL<{ echo: string }>(query);

      expect(response.statusCode).toBe(200);
      expect(response.errors).toBeUndefined();
      expect(response.data?.echo).toBe('hello world');
    });

    it('should echo text for mutations', async () => {
      const mutation = 'mutation { echo(text: "mutation test") }';

      const response = await client.requestGraphQL<{ echo: string }>(mutation);

      expect(response.statusCode).toBe(200);
      expect(response.errors).toBeUndefined();
      expect(response.data?.echo).toBe('mutation test');
    });
  });

  describe('Debug query', () => {
    it('should return debug data without auth', async () => {
      const query = 'query { debug }';

      const response = await client.requestGraphQL<{ debug: string }>(query);

      expect(response.statusCode).toBe(200);
      expect(response.errors).toBeUndefined();
      expect(response.data?.debug).toBeDefined();
    });
  });

  describe('Authentication-sensitive queries', () => {
    it('should respond with data for me query', async () => {
      const query = 'query { me { id } }';

      const response = await client.requestGraphQL<{
        me: { id: number } | null;
      }>(query);

      expect(response.statusCode).toBe(200);
      expect(response.errors).toBeUndefined();
      expect(response.data).toHaveProperty('me');
      expect(String(response.data?.me?.id)).toBe('1');
    });

    it('should return data or errors for updateProfile without auth', async () => {
      const mutation = 'mutation { updateProfile(input: {}) { id } }';

      const response = await client.requestGraphQL(mutation);

      expect(response.statusCode).toBe(200);
      expect(response.data).toBeDefined();
    });
  });

  describe('GraphQL error handling', () => {
    it('should surface validation errors for invalid fields', async () => {
      const query = 'query { invalidField }';

      const response = await client.requestGraphQL(query);

      expect(response.statusCode).toBe(200);
      expect(response.errors).toBeDefined();
    });

    it('should error when the request payload is malformed', async () => {
      const response = await client.request({
        method: 'POST',
        url: '/graphql',
        payload: { notAQuery: 'test' },
        headers: { 'content-type': 'application/json' },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toHaveProperty('errors');
    });
  });
});

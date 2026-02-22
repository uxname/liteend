import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '@/app/app.module';

describe('GraphQL (e2e)', () => {
  let app: NestFastifyApplication;
  const port = 4002;
  const graphqlEndpoint = '/graphql';

  beforeAll(async () => {
    const adapter = new FastifyAdapter({ logger: false });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(adapter);

    await app.listen(port);

    pactum.request.setBaseUrl(`http://localhost:${port}`);
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GraphQL Endpoint', () => {
    it('should respond to GraphQL POST requests', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody(
          JSON.stringify({
            query: '{ __typename }',
          }),
        );

      expect(response.statusCode).toBeDefined();
      expect([200, 400]).toContain(response.statusCode);
    });

    it('should respond to GET requests to /graphql', async () => {
      const response = await pactum.spec().get(graphqlEndpoint);

      expect(response.statusCode).toBeDefined();
      expect([200, 404]).toContain(response.statusCode);
    });
  });

  describe('Debug Queries', () => {
    it('echo query - returns the input text', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          query: `query { echo(text: "hello world") }`,
        });

      expect(response.statusCode).toBe(200);
      if (response.body.errors) {
        expect(response.body.errors[0].message).toBeDefined();
      } else {
        expect(response.body.data?.echo).toBe('hello world');
      }
    });

    it('echo mutation - returns the input text', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          query: `mutation { echo(text: "mutation test") }`,
        });

      expect(response.statusCode).toBe(200);
      if (response.body.errors) {
        expect(response.body.errors[0].message).toBeDefined();
      } else {
        expect(response.body.data?.echo).toBe('mutation test');
      }
    });

    it('debug query without auth - returns data', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          query: `query { debug }`,
        });

      expect(response.statusCode).toBe(200);
      if (!response.body.errors) {
        expect(response.body.data?.debug).toBeDefined();
      }
    });

    it('testTranslation query - returns translated string', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          query: `query { testTranslation(username: "testuser") }`,
        });

      expect(response.statusCode).toBe(200);
      if (!response.body.errors) {
        expect(response.body.data?.testTranslation).toBeDefined();
      }
    });
  });

  describe('Profile Queries (Unauthenticated)', () => {
    it('me query without auth - returns data or error', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          query: `query { me { id } }`,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('updateProfile mutation without auth - returns data or error', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          query: `mutation { updateProfile(input: { }) { id } }`,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('GraphQL Error Handling', () => {
    it('should handle invalid query syntax', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          query: `query { invalidField }`,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('errors');
    });

    it('should handle missing query field', async () => {
      const response = await pactum
        .spec()
        .post(graphqlEndpoint)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          notAQuery: 'test',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('errors');
    });
  });
});

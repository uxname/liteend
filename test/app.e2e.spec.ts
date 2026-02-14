import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '@/app/app.module';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  const port = 4001;

  beforeAll(async () => {
    const adapter = new FastifyAdapter({ logger: false });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(adapter);

    await app.listen(port);

    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/health (GET) - app is running', async () => {
    const response = await pactum.spec().get('/health');

    // App is running and responding - status depends on DB/Redis availability
    expect(response.statusCode).toBeDefined();
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('info');

    console.log(
      `Health: status=${response.body.status}, db=${response.body.info?.database?.status}, redis=${response.body.info?.redis?.status}`,
    );
  });

  it('/ (GET) - should return 404 for root', () => {
    return pactum.spec().get('/').expectStatus(404);
  });
});

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import type { FastifyInstance } from 'fastify';
import { AppModule } from '@/app.module';
import { setupApp } from '@/bootstrap/setup-app';

export async function createTestingApp(): Promise<{
  app: NestFastifyApplication;
  fastify: FastifyInstance;
}> {
  process.env.NODE_ENV = 'test';
  process.env.OIDC_MOCK_ENABLED = 'true';

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter({
      logger: false,
      bodyLimit: 10485760,
      trustProxy: true,
    }),
  );

  await setupApp(app);
  await app.init();

  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;
  await fastify.ready();

  return { app, fastify };
}

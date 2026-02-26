import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import type { FastifyInstance } from 'fastify';
import type Redis from 'ioredis';
import { AppModule } from '@/app.module';
import { setupApp } from '@/bootstrap/setup-app';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';

let cachedApp: NestFastifyApplication | undefined;
let cachedFastify: FastifyInstance | undefined;
let cachedPrisma: PrismaService | undefined;
let cachedRedis: Redis | undefined;

export async function createTestingApp(): Promise<{
  app: NestFastifyApplication;
  fastify: FastifyInstance;
  prisma: PrismaService;
  redis: Redis;
}> {
  if (cachedApp && cachedFastify && cachedPrisma && cachedRedis) {
    return {
      app: cachedApp,
      fastify: cachedFastify,
      prisma: cachedPrisma,
      redis: cachedRedis,
    };
  }

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
    {
      bufferLogs: true,
    },
  );

  await setupApp(app);
  await app.init();

  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;
  await fastify.ready();

  const prisma = app.get(PrismaService);
  const redisService = app.get(RedisService);
  const redis = redisService.getClient();

  cachedApp = app;
  cachedFastify = fastify;
  cachedPrisma = prisma;
  cachedRedis = redis;

  return { app, fastify, prisma, redis };
}

function invariant<T>(value: T | undefined, message: string): T {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export function getTestingApp(): NestFastifyApplication {
  return invariant(cachedApp, 'Testing app is not initialized');
}

export function getFastifyInstance(): FastifyInstance {
  return invariant(cachedFastify, 'Fastify instance is not initialized');
}

export function getPrisma(): PrismaService {
  return invariant(cachedPrisma, 'Prisma service is not initialized');
}

export function getRedis(): Redis {
  return invariant(cachedRedis, 'Redis client is not initialized');
}

export async function closeTestingApp() {
  if (cachedApp) {
    await cachedApp.close();
  }

  if (cachedPrisma) {
    await cachedPrisma.$disconnect();
  }

  cachedApp = undefined;
  cachedFastify = undefined;
  cachedPrisma = undefined;
  cachedRedis = undefined;
}

import type { Redis } from 'ioredis';
import type { PrismaClient } from '@/@generated/prisma/client';

export async function clearDatabase(prisma: PrismaClient) {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations';
  `;

  for (const { tablename } of tables) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`,
    );
  }
}

export async function clearRedis(redis: Redis) {
  await redis.flushall();
}

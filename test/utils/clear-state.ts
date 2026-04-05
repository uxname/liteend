import type { Redis } from 'ioredis';
import type { PrismaClient } from '@/@generated/prisma/client';

// Cache table names to speed up tests
let tableNamesCache: string[] | null = null;

export function resetTableNamesCache() {
  tableNamesCache = null;
}

export async function clearDatabase(prisma: PrismaClient) {
  if (!tableNamesCache) {
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename <> '_prisma_migrations';
    `;
    tableNamesCache = tables.map((t) => t.tablename);
  }

  for (const tablename of tableNamesCache) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`,
    );
  }
}

export async function clearRedis(redis: Redis) {
  await redis.flushall();
}

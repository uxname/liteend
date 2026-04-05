import type { Redis } from 'ioredis';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@/@generated/prisma/client';
import { clearDatabase, clearRedis, resetTableNamesCache } from './clear-state';

describe('clear-state helpers', () => {
  beforeEach(() => {
    resetTableNamesCache();
  });

  it('should truncate all tables and flush redis', async () => {
    const prisma = {
      $queryRaw: vi
        .fn()
        .mockResolvedValue([{ tablename: 'users' }, { tablename: 'orders' }]),
      $executeRawUnsafe: vi.fn(),
    } as unknown as PrismaClient;
    const redis = {
      flushall: vi.fn().mockResolvedValue('OK'),
    } as unknown as Redis;

    await clearDatabase(prisma);
    await clearRedis(redis);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(prisma.$executeRawUnsafe).toHaveBeenCalledTimes(2);
    expect(prisma.$executeRawUnsafe).toHaveBeenNthCalledWith(
      1,
      'TRUNCATE TABLE "public"."users" RESTART IDENTITY CASCADE;',
    );
    expect(prisma.$executeRawUnsafe).toHaveBeenNthCalledWith(
      2,
      'TRUNCATE TABLE "public"."orders" RESTART IDENTITY CASCADE;',
    );
    expect(redis.flushall).toHaveBeenCalledTimes(1);
  });
});

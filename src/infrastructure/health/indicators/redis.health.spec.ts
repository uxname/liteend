import { HealthIndicatorService } from '@nestjs/terminus';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RedisService } from '@/common/redis/redis.service';
import { RedisHealthIndicator } from './redis.health';

const makeIndicatorResult = (status: 'up' | 'down') => ({
  redis: { status },
});

const makeHealthIndicatorService = () => {
  const up = vi.fn().mockReturnValue(makeIndicatorResult('up'));
  const down = vi.fn().mockReturnValue(makeIndicatorResult('down'));
  return {
    service: {
      check: vi.fn().mockReturnValue({ up, down }),
    } as unknown as HealthIndicatorService,
    up,
    down,
  };
};

const makeRedisService = (pingImpl: () => Promise<string>) => ({
  getClient: vi
    .fn()
    .mockReturnValue({ ping: vi.fn().mockImplementation(pingImpl) }),
});

describe('RedisHealthIndicator', () => {
  let indicator: RedisHealthIndicator;
  let healthMocks: ReturnType<typeof makeHealthIndicatorService>;

  beforeEach(() => {
    healthMocks = makeHealthIndicatorService();
  });

  it('should return up when Redis responds with PONG', async () => {
    const redisService = makeRedisService(() => Promise.resolve('PONG'));
    indicator = new RedisHealthIndicator(
      redisService as unknown as RedisService,
      healthMocks.service,
    );

    const result = await indicator.isHealthy();

    expect(healthMocks.up).toHaveBeenCalled();
    expect(result).toEqual(makeIndicatorResult('up'));
  });

  it('should return down when Redis responds with a non-PONG value', async () => {
    const redisService = makeRedisService(() => Promise.resolve('NOT_PONG'));
    indicator = new RedisHealthIndicator(
      redisService as unknown as RedisService,
      healthMocks.service,
    );

    const result = await indicator.isHealthy();

    expect(healthMocks.down).toHaveBeenCalled();
    expect(result).toEqual(makeIndicatorResult('down'));
  });

  it('should return down and not rethrow when ping throws (network error)', async () => {
    const redisService = makeRedisService(() =>
      Promise.reject(new Error('Connection timeout')),
    );
    indicator = new RedisHealthIndicator(
      redisService as unknown as RedisService,
      healthMocks.service,
    );

    await expect(indicator.isHealthy()).resolves.toEqual(
      makeIndicatorResult('down'),
    );
    expect(healthMocks.down).toHaveBeenCalled();
  });
});

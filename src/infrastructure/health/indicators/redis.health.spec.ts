import { HealthIndicatorService } from '@nestjs/terminus';
import type { Redis } from 'ioredis';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RedisService } from '@/common/redis/redis.service';
import { mock } from '../../../../test/utils/mocks';
import { RedisHealthIndicator } from './redis.health';

const makeIndicatorResult = (status: 'up' | 'down') => ({
  redis: { status },
});

const makeHealthIndicatorService = () => {
  const health = mock<HealthIndicatorService>();
  const up = vi.fn().mockReturnValue(makeIndicatorResult('up'));
  const down = vi.fn().mockReturnValue(makeIndicatorResult('down'));
  // biome-ignore lint/suspicious/noExplicitAny: HealthIndicatorSession has private key
  vi.mocked(health.check).mockReturnValue({ up, down } as any);
  return { service: health, up, down };
};

const makeRedisService = (pingImpl: () => Promise<string>) => {
  const svc = mock<RedisService>();
  const client = mock<Redis>();
  vi.mocked(client.ping).mockImplementation(pingImpl);
  vi.mocked(svc.getClient).mockReturnValue(client);
  return svc;
};

describe('RedisHealthIndicator', () => {
  let indicator: RedisHealthIndicator;
  let healthMocks: ReturnType<typeof makeHealthIndicatorService>;

  beforeEach(() => {
    healthMocks = makeHealthIndicatorService();
  });

  it('should return up when Redis responds with PONG', async () => {
    const redisService = makeRedisService(() => Promise.resolve('PONG'));
    indicator = new RedisHealthIndicator(redisService, healthMocks.service);

    const result = await indicator.isHealthy();

    expect(healthMocks.up).toHaveBeenCalled();
    expect(result).toEqual(makeIndicatorResult('up'));
  });

  it('should return down when Redis responds with a non-PONG value', async () => {
    const redisService = makeRedisService(() => Promise.resolve('NOT_PONG'));
    indicator = new RedisHealthIndicator(redisService, healthMocks.service);

    const result = await indicator.isHealthy();

    expect(healthMocks.down).toHaveBeenCalled();
    expect(result).toEqual(makeIndicatorResult('down'));
  });

  it('should return down and not rethrow when ping throws (network error)', async () => {
    const redisService = makeRedisService(() =>
      Promise.reject(new Error('Connection timeout')),
    );
    indicator = new RedisHealthIndicator(redisService, healthMocks.service);

    await expect(indicator.isHealthy()).resolves.toEqual(
      makeIndicatorResult('down'),
    );
    expect(healthMocks.down).toHaveBeenCalled();
  });
});

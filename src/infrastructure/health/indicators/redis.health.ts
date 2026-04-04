import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly redisService: RedisService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check('redis');

    try {
      const pong = await this.redisService.getClient().ping();

      if (pong !== 'PONG') {
        return indicator.down();
      }

      return indicator.up();
    } catch (_error) {
      return indicator.down();
    }
  }
}

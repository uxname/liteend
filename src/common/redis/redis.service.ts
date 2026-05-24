import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import {
  REDIS_CONNECT_TIMEOUT,
  REDIS_RETRY_BASE_DELAY,
  REDIS_RETRY_MAX_DELAY,
} from '@/common/constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.getOrThrow<string>('REDIS_HOST');
    const port = Number.parseInt(
      this.configService.getOrThrow<string>('REDIS_PORT'),
      10,
    );
    const password = this.configService.getOrThrow<string>('REDIS_PASSWORD');

    this.client = new Redis({
      host,
      port,
      password,
      connectTimeout: REDIS_CONNECT_TIMEOUT,
      maxRetriesPerRequest: 20,
      retryStrategy: (times) => {
        return (
          Math.min(times * REDIS_RETRY_BASE_DELAY, REDIS_RETRY_MAX_DELAY) *
          (0.5 + Math.random() * 0.5)
        );
      },
      lazyConnect: true,
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}

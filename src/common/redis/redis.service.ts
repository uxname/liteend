import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

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
      connectTimeout: 10000,
      maxRetriesPerRequest: null,
      retryStrategy: (times) => {
        if (times > 10) return null;
        return Math.min(times * 200, 3000);
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

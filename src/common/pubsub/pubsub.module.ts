import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => {
        const options = {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          retryStrategy: (times: number) => {
            return Math.min(times * 50, 2000);
          },
        };

        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}

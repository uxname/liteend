import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '@/common/redis/redis.module';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './indicators/redis.health';

@Module({
  imports: [TerminusModule, RedisModule],
  providers: [RedisHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}

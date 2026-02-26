import { Module } from '@nestjs/common';
import { RedisModule } from '@/common/redis/redis.module';

import { HealthController } from './health.controller';

@Module({
  imports: [RedisModule],
  providers: [HealthController],
  controllers: [HealthController],
  exports: [HealthController],
})
export class HealthModule {}

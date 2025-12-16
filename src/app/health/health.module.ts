import { Module } from '@nestjs/common';

import { HealthController } from '@/app/health/health.controller';

@Module({
  providers: [HealthController],
  controllers: [HealthController],
  exports: [HealthController],
})
export class HealthModule {}

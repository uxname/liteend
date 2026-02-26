import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';

@Module({
  providers: [HealthController],
  controllers: [HealthController],
  exports: [HealthController],
})
export class HealthModule {}

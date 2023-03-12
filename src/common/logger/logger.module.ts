import { Global, Logger as LoggerNest, Module } from '@nestjs/common';

import { Logger } from '@/common/logger/logger';

@Global()
@Module({
  providers: [Logger, LoggerNest],
  exports: [Logger, LoggerNest],
})
export class LoggerModule {}

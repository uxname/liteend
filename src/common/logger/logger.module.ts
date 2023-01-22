import { Global, Logger as LoggerNest, Module } from '@nestjs/common';

import { Logger } from '@/common/logger/logger';
import { LoggerServeModule } from '@/common/logger-serve/logger-serve.module';

@Global()
@Module({
  imports: [LoggerServeModule],
  providers: [Logger, LoggerNest],
  exports: [Logger, LoggerNest],
})
export class LoggerModule {}

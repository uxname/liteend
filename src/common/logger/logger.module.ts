import { Global, Logger as LoggerNest, Module } from '@nestjs/common';

import { HttpLoggerMiddleware } from '@/common/logger/http-logger-middleware';
import { Logger } from '@/common/logger/logger';

@Global()
@Module({
  providers: [Logger, LoggerNest, HttpLoggerMiddleware],
  exports: [Logger, LoggerNest, HttpLoggerMiddleware],
})
export class LoggerModule {}

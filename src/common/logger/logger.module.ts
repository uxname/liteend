import { Global, Module } from '@nestjs/common';

import { HttpLoggerMiddleware } from '@/common/logger/http-logger-middleware';

@Global()
@Module({
  providers: [HttpLoggerMiddleware],
  exports: [HttpLoggerMiddleware],
})
export class LoggerModule {}

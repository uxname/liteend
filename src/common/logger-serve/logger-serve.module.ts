import { Module } from '@nestjs/common';

import { LoggerServeController } from './logger-serve.controller';

@Module({
  controllers: [LoggerServeController],
})
export class LoggerServeModule {}

import { DynamicModule, Module } from '@nestjs/common';

import { LoggerServeService } from './logger-serve.service';

// Create LoggerServeModule that creates a LoggerServeService instance, configures it, and exports it.

@Module({
  imports: [],
  providers: [LoggerServeService],
})
export class LoggerServeModule {
  // todo add logs route to init
  static forRoot(): DynamicModule {
    return {
      module: LoggerServeModule,
      providers: [LoggerServeService],
      exports: [LoggerServeService],
    };
  }
}

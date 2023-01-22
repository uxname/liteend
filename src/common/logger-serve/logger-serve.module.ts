import { DynamicModule, Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

import { LoggerServeService } from './logger-serve.service';

// Create LoggerServeModule that creates a LoggerServeService instance, configures it, and exports it.

@Module({
  imports: [EasyconfigModule],
  providers: [LoggerServeService],
})
export class LoggerServeModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerServeModule,
      providers: [LoggerServeService],
      exports: [LoggerServeService],
    };
  }
}

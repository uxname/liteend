import { DynamicModule, Module } from '@nestjs/common';

import { LoggerServeService } from './logger-serve.service';

interface LoggerServeModuleParameters {
  route: string;
}

@Module({})
export class LoggerServeModule {
  static forRoot(parameters: LoggerServeModuleParameters): DynamicModule {
    return {
      module: LoggerServeModule,
      providers: [
        LoggerServeService,
        {
          provide: 'ROUTE',
          useValue: parameters.route,
        },
      ],
      exports: [LoggerServeService],
    };
  }
}

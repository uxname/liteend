import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@/common/logger/logger.module';

import { LoggerServeController } from './logger-serve.controller';

describe('LoggerServeService', () => {
  let service: LoggerServeController;

  beforeEach(async () => {
    const adapterHostMock = {
      httpAdapter: {
        getInstance: jest.fn(() => {
          return {
            use: jest.fn(),
          };
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: HttpAdapterHost,
          useValue: adapterHostMock,
        },
        {
          provide: 'ROUTE',
          useValue: '/logs',
        },
        LoggerServeController,
      ],
    }).compile();

    service = module.get<LoggerServeController>(LoggerServeController);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

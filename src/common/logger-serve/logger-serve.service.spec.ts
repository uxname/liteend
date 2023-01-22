import { Test, TestingModule } from '@nestjs/testing';

import { LoggerServeService } from './logger-serve.service';

describe('LoggerServeService', () => {
  let service: LoggerServeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerServeService],
    }).compile();

    service = module.get<LoggerServeService>(LoggerServeService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

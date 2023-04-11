import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@/common/logger/logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Logger],
    }).compile();

    logger = module.get<Logger>(Logger);
  });

  test('should be defined', () => {
    logger.debug('Test');
    expect(logger).toBeDefined();
  });
});

import { Logger } from '@/common/logger/logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(async () => {
    logger = new Logger('TestLogger');
  });

  test('should be defined', () => {
    logger.debug('Test logger message');
    expect(logger).toBeDefined();
  });
});

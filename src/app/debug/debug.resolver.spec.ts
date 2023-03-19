import { Test, TestingModule } from '@nestjs/testing';

import { DebugResolver } from './debug.resolver';

describe('QueryResolver', () => {
  let resolver: DebugResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebugResolver],
    }).compile();

    resolver = module.get<DebugResolver>(DebugResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

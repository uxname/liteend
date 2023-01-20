import { Test, TestingModule } from '@nestjs/testing';

import { AccountResolver } from './account.resolver';

describe('UserResolver', () => {
  let resolver: AccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountResolver],
    }).compile();

    resolver = module.get<AccountResolver>(AccountResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { AccountModule } from '@/app/account/account.module';
import { AccountSessionModule } from '@/app/account-session/account-session.module';
import { LoggerModule } from '@/common/logger/logger.module';

import { AccountResolver } from './account.resolver';

describe('UserResolver', () => {
  let resolver: AccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountSessionModule, AccountModule, LoggerModule],
      providers: [AccountResolver],
    }).compile();

    resolver = module.get<AccountResolver>(AccountResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

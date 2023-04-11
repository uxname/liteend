import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountSessionResolver } from './account-session.resolver';
import { AccountSessionService } from './account-session.service';

describe('AccountSessionResolver', () => {
  let resolver: AccountSessionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AccountSessionResolver, AccountSessionService],
    }).compile();

    resolver = module.get<AccountSessionResolver>(AccountSessionResolver);
  });

  test('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { AccountSessionModule } from '@/app/account-session/account-session.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountGateway } from './account.gateway';

describe('AccountGateway', () => {
  let gateway: AccountGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, PrismaModule, AccountSessionModule],
      providers: [AccountGateway],
    }).compile();

    gateway = module.get<AccountGateway>(AccountGateway);
  });

  test('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

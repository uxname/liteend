import { Test, TestingModule } from '@nestjs/testing';

import { AccountModule } from '@/app/account/account.module';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountService } from './account.service';

describe('UserService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, CryptoModule, AccountModule, LoggerModule],
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

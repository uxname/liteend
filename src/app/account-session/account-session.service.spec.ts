import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountSessionService } from './account-session.service';

describe('AccountSessionService', () => {
  let service: AccountSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AccountSessionService],
    }).compile();

    service = module.get<AccountSessionService>(AccountSessionService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

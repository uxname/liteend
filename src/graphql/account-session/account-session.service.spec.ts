import { Test, TestingModule } from '@nestjs/testing';

import { AccountSessionService } from './account-session.service';

describe('AccountSessionService', () => {
  let service: AccountSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountSessionService],
    }).compile();

    service = module.get<AccountSessionService>(AccountSessionService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

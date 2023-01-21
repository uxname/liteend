import { Test, TestingModule } from '@nestjs/testing';

import { AccountService } from './account.service';

describe('UserService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

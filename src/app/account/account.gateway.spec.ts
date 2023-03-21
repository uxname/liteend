import { Test, TestingModule } from '@nestjs/testing';

import { AccountGateway } from './account.gateway';

describe('AccountGateway', () => {
  let gateway: AccountGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountGateway],
    }).compile();

    gateway = module.get<AccountGateway>(AccountGateway);
  });

  test('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

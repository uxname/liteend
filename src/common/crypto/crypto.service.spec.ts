import { Test, TestingModule } from '@nestjs/testing';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  test('should hash data', async () => {
    const text = 'Hello';
    const salt = '123';
    const hash = await service.hash(text, salt);
    expect(hash).toBeDefined();

    const isMatch = await service.hashVerify(text, salt, hash);
    expect(isMatch).toBe(true);
  });
});

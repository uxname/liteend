import { Test, TestingModule } from '@nestjs/testing';

import { CryptoService, RandomStringType } from './crypto.service';

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

  test('should generate random string', async () => {
    const size = 48;
    const randomString = await service.generateRandomString(
      RandomStringType.ACCESS_TOKEN,
      size,
      true,
    );
    expect(randomString).toBeDefined();
    expect(randomString).toHaveLength(size);

    const randomString2 = await service.generateRandomString(
      RandomStringType.ACCESS_TOKEN,
      size,
      false,
    );
    expect(randomString2).toBeDefined();
    expect(randomString2).toHaveLength(
      size + RandomStringType.ACCESS_TOKEN.length,
    );
  });
});

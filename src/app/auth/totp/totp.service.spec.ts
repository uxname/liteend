import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { TotpService } from './totp.service';

describe('TotpService', () => {
  let service: TotpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [TotpService],
    }).compile();

    service = module.get<TotpService>(TotpService);
  });

  test('should generate and check TOTP', () => {
    expect(service).toBeDefined();
    const secret = service.generateSecret();
    const token = service.generateToken(secret);
    expect(service.verifyToken(secret, token)).toBe(true);
  });
});

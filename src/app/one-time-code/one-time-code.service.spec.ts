import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@/common/prisma/prisma.module';

import { OneTimeCodeService } from './one-time-code.service';

describe('OneTimeCodeService', () => {
  let service: OneTimeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OneTimeCodeService],
    }).compile();

    service = module.get<OneTimeCodeService>(OneTimeCodeService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { PrismaStudioService } from './prisma-studio.service';

describe('PrismaStudioService', () => {
  let service: PrismaStudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaStudioService],
    }).compile();

    service = module.get<PrismaStudioService>(PrismaStudioService);
  });

  test('should work', async () => {
    expect(service).toBeDefined();

    service.startStudio();
  });
});

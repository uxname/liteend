import { Test, TestingModule } from '@nestjs/testing';

import { PrismaStudioController } from './prisma-studio.controller';

describe('PrismaStudioController', () => {
  let controller: PrismaStudioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrismaStudioController],
    }).compile();

    controller = module.get<PrismaStudioController>(PrismaStudioController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

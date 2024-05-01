import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaStudioModule } from '@/common/prisma-studio/prisma-studio.module';

import { PrismaStudioController } from './prisma-studio.controller';

describe('PrismaStudioController', () => {
  let controller: PrismaStudioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaStudioModule, ConfigModule.forRoot()],
      controllers: [PrismaStudioController],
    }).compile();

    controller = module.get<PrismaStudioController>(PrismaStudioController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

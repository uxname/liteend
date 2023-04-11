import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@/common/prisma/prisma.module';

import { FileUploadController } from './file-upload.controller';

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [FileUploadController],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

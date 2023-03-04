import { Test, TestingModule } from '@nestjs/testing';

import { FileUploadController } from './file-upload.controller';

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

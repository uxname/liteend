import { Module } from '@nestjs/common';

import { FileUploadController } from './file-upload.controller';

import { FileUploadService } from './file-upload.service';

@Module({
  providers: [FileUploadService],
  controllers: [FileUploadController],
})
export class FileUploadModule {}

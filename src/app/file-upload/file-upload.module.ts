import { Module } from '@nestjs/common';

import { FileUploadController } from '@/app/file-upload/file-upload.controller';

import { FileUploadService } from './file-upload.service';

@Module({
  providers: [FileUploadController, FileUploadService],
  controllers: [FileUploadController],
  exports: [FileUploadController],
})
export class FileUploadModule {}

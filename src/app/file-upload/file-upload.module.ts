import { Module } from '@nestjs/common';

import { FileUploadController } from '@/app/file-upload/file-upload.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { FileUploadService } from './file-upload.service';

@Module({
  imports: [PrismaModule],
  providers: [FileUploadController, FileUploadService],
  controllers: [FileUploadController],
  exports: [FileUploadController],
})
export class FileUploadModule {}

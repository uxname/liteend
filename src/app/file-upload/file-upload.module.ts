import { Module } from '@nestjs/common';

import { FileUploadController } from '@/app/file-upload/file-upload.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FileUploadController],
  controllers: [FileUploadController],
  exports: [FileUploadController],
})
export class FileUploadModule {}

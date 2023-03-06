import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GraphqlModule } from '@/app/graphql/graphql.module';
import { Page404Filter } from '@/app/page-404/page-404.filter';
import { LoggerModule } from '@/common/logger/logger.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { FileUploadController } from './file-upload/file-upload.controller';
import { HealthController } from './health/health.controller';

@Module({
  imports: [GraphqlModule, LoggerModule, PrismaModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: Page404Filter,
    },
  ],
  controllers: [FileUploadController, HealthController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaStudioService } from '@/common/prisma-studio/prisma-studio.service';

import { PrismaStudioController } from './prisma-studio.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaStudioService],
  controllers: [PrismaStudioController],
})
export class PrismaStudioModule {
  constructor(readonly prismaStudioService: PrismaStudioService) {
    prismaStudioService.startStudio();
  }
}

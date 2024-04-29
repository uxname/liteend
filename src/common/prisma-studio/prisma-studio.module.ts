import { Module } from '@nestjs/common';

import { PrismaStudioService } from '@/common/prisma-studio/prisma-studio.service';

import { PrismaStudioController } from './prisma-studio.controller';

@Module({
  providers: [PrismaStudioService],
  controllers: [PrismaStudioController],
})
export class PrismaStudioModule {
  constructor(private readonly prismaStudioService: PrismaStudioService) {
    prismaStudioService.startStudio();
  }
}

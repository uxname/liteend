import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Logger } from '@/common/logger/logger';
import { PrismaStudioService } from '@/common/prisma-studio/prisma-studio.service';

import { PrismaStudioController } from './prisma-studio.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaStudioService],
  controllers: [PrismaStudioController],
})
export class PrismaStudioModule implements OnModuleInit {
  private readonly logger = new Logger(PrismaStudioModule.name);

  constructor(readonly prismaStudioService: PrismaStudioService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Starting Prisma Studio...');
    this.prismaStudioService.startStudio().catch((error) => {
      this.logger.error(error);
    });
  }
}

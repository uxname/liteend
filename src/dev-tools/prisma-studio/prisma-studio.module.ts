import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaStudioController } from './prisma-studio.controller';
import { PrismaStudioService } from './prisma-studio.service';

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

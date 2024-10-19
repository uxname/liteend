import { Module } from '@nestjs/common';

import { DebugResolver } from '@/app/debug/debug.resolver';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DebugResolver],
  exports: [DebugResolver],
})
export class DebugModule {}

import { Module } from '@nestjs/common';
import { AccountSessionService } from './account-session.service';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AccountSessionService],
  exports: [AccountSessionService],
})
export class AccountSessionModule {}

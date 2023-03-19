import { Module } from '@nestjs/common';

import { AccountSessionResolver } from '@/app/account-session/account-session.resolver';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountSessionService } from './account-session.service';

@Module({
  imports: [PrismaModule],
  providers: [AccountSessionService, AccountSessionResolver],
  exports: [AccountSessionService],
})
export class AccountSessionModule {}

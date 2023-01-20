import { Module } from '@nestjs/common';

import { PrismaModule } from '@/common/prisma/prisma.module';
import { AccountSessionResolver } from '@/graphql/account-session/account-session.resolver';

import { AccountSessionService } from './account-session.service';

@Module({
  imports: [PrismaModule],
  providers: [AccountSessionService, AccountSessionResolver],
  exports: [AccountSessionService],
})
export class AccountSessionModule {}

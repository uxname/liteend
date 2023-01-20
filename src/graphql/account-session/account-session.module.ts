import { Module } from '@nestjs/common';
import { AccountSessionService } from './account-session.service';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AccountSessionResolver } from '@/graphql/account-session/account-session.resolver';

@Module({
  imports: [PrismaModule],
  providers: [AccountSessionService, AccountSessionResolver],
  exports: [AccountSessionService],
})
export class AccountSessionModule {}

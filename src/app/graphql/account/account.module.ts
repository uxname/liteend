import { Module } from '@nestjs/common';

import { AccountSessionModule } from '@/app/graphql/account-session/account-session.module';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
  imports: [PrismaModule, CryptoModule, AccountSessionModule],
  providers: [AccountService, AccountResolver],
  exports: [AccountService],
})
export class AccountModule {}

import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { AccountSessionModule } from '@/graphql/account-session/account-session.module';

@Module({
  imports: [PrismaModule, CryptoModule, AccountSessionModule],
  providers: [AccountService, AccountResolver],
  exports: [AccountService],
})
export class AccountModule {}

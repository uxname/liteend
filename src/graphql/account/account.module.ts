import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { CryptoModule } from '@/common/crypto/crypto.module';

@Module({
  imports: [PrismaModule, CryptoModule],
  providers: [AccountService, AccountResolver],
  exports: [AccountService],
})
export class AccountModule {}

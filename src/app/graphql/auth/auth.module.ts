import { Module } from '@nestjs/common';

import { AccountModule } from '@/app/graphql/account/account.module';
import { AccountSessionModule } from '@/app/graphql/account-session/account-session.module';
import { AuthResolver } from '@/app/graphql/auth/auth.resolver';
import { EmailModule } from '@/app/graphql/email/email.module';
import { OneTimeCodeModule } from '@/app/graphql/one-time-code/one-time-code.module';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AuthService } from './auth.service';

@Module({
  imports: [
    CryptoModule,
    PrismaModule,
    AccountModule,
    AccountSessionModule,
    OneTimeCodeModule,
    EmailModule,
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthResolver],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from '@/app/account/account.module';
import { AccountSessionModule } from '@/app/account-session/account-session.module';
import { AuthResolver } from '@/app/auth/auth.resolver';
import { EmailModule } from '@/app/email/email.module';
import { OneTimeCodeModule } from '@/app/one-time-code/one-time-code.module';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { AuthService } from './auth.service';
import { TotpService } from './totp/totp.service';

@Module({
  imports: [
    ConfigModule,
    CryptoModule,
    PrismaModule,
    AccountModule,
    AccountSessionModule,
    OneTimeCodeModule,
    EmailModule,
  ],
  providers: [AuthService, AuthResolver, TotpService],
  exports: [AuthService, AuthResolver],
})
export class AuthModule {}

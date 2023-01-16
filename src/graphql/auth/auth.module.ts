import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from '@/graphql/auth/local.strategy';
import { AuthResolver } from '@/graphql/auth/auth.resolver';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AccountModule } from '@/graphql/account/account.module';
import { AccountSessionModule } from '@/graphql/account-session/account-session.module';

@Module({
  imports: [
    EasyconfigModule,
    CryptoModule,
    PrismaModule,
    AccountModule,
    AccountSessionModule,
  ],
  providers: [AuthService, LocalStrategy, AuthResolver],
  exports: [AuthResolver],
})
export class AuthModule {}

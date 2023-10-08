import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { TotpService } from '@/app/auth/totp/totp.service';
import { CryptoService } from '@/common/crypto/crypto.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly totpService: TotpService,
  ) {}

  async validateAccountPassword(
    email: string,
    password: string,
  ): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: {
        email,
      },
    });
    if (account) {
      const salt = this.configService.getOrThrow<string>('SALT');
      const isPasswordValid = await this.cryptoService.hashVerify(
        password,
        salt,
        account.passwordHash,
      );

      if (isPasswordValid) {
        return account;
      } else {
        throw new Error(this.i18n.t('errors.invalidPassword'));
      }
    } else {
      throw new Error(this.i18n.t('errors.accountNotFound'));
    }
  }

  async generateTotpSecret(
    profileId: number,
    token: string | undefined,
  ): Promise<string> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    if (profile) {
      if (profile.totpEnabled) {
        if (!token) {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          throw new Error(this.i18n.t('errors.invalidToken'));
        }

        if (!profile.totpSecret) {
          throw new Error(this.i18n.t('errors.totpTokenNotSet'));
        }

        const isTokenValid = this.totpService.verifyToken(
          profile.totpSecret,
          token,
        );

        if (!isTokenValid) {
          throw new Error(this.i18n.t('errors.invalidToken'));
        }

        const secret = this.totpService.generateSecret();
        await this.prisma.profile.update({
          where: { id: profileId },
          data: { totpSecret: secret },
        });
        return secret;
      } else {
        const secret = this.totpService.generateSecret();
        await this.prisma.profile.update({
          where: { id: profileId },
          data: { totpSecret: secret },
        });
        return secret;
      }
    } else {
      throw new Error(this.i18n.t('errors.profileNotFound'));
    }
  }

  async changeTotpEnabled(
    profileId: number,
    token: string,
    enabled: boolean,
  ): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    if (profile) {
      if (!profile.totpSecret) {
        throw new Error(this.i18n.t('errors.totpTokenNotSet'));
      }
      const isTokenValid = this.totpService.verifyToken(
        profile.totpSecret,
        token,
      );
      if (isTokenValid) {
        await this.prisma.profile.update({
          where: { id: profileId },
          data: { totpEnabled: enabled },
        });
        return true;
      } else {
        throw new Error(this.i18n.t('errors.invalidToken'));
      }
    } else {
      throw new Error(this.i18n.t('errors.profileNotFound'));
    }
  }
}

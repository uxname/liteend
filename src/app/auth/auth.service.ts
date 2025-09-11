import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/@generated/i18n-types';
import { Account } from '@/app/account/types/account.object-type';
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
      where: { email },
      include: { profile: true },
    });

    if (!account) {
      throw new Error(this.i18n.t('errors.accountNotFound'));
    }

    if (account.profile?.status !== AccountStatus.ACTIVE) {
      throw new Error(this.i18n.t('errors.accountSuspended'));
    }

    const salt = this.configService.getOrThrow<string>('SALT');
    const isPasswordValid = await this.cryptoService.hashVerify(
      password,
      salt,
      account.passwordHash,
    );

    if (isPasswordValid) {
      return account;
    }
    throw new Error(this.i18n.t('errors.invalidPassword'));
  }

  async generateTotpSecret(
    profileId: number,
    token: string | undefined,
  ): Promise<string> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new Error(this.i18n.t('errors.profileNotFound'));
    }

    if (profile.totpEnabled) {
      if (!token) {
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
    }

    const secret = this.totpService.generateSecret();
    await this.prisma.profile.update({
      where: { id: profileId },
      data: { totpSecret: secret },
    });

    return secret;
  }

  async changeTotpEnabled(
    profileId: number,
    token: string,
    enabled: boolean,
  ): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new Error(this.i18n.t('errors.profileNotFound'));
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

    await this.prisma.profile.update({
      where: { id: profileId },
      data: { totpEnabled: enabled },
    });

    return true;
  }
}

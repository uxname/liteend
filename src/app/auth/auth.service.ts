import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { CryptoService } from '@/common/crypto/crypto.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService<I18nTranslations>,
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
}

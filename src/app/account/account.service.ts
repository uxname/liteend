import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileRole } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Account, AccountStatus } from '@/app/account/types';
import { Profile } from '@/app/profile/types';
import { CryptoService } from '@/common/crypto/crypto.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async createAccount(
    email: string,
    password: string,
    status: AccountStatus = AccountStatus.ACTIVE,
  ): Promise<Account> {
    const salt = this.configService.getOrThrow<string>('SALT');
    const passwordHash = await this.crypto.hash(password, salt);
    return this.prisma.account.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            roles: [ProfileRole.USER],
            status,
          },
        },
      },
    });
  }

  async getAccountByEmail(email: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        email,
      },
    });
  }

  async changePassword(email: string, newPassword: string): Promise<Account> {
    const salt = this.configService.getOrThrow<string>('SALT');

    const newPasswordHash = await this.crypto.hash(newPassword, salt);
    return this.prisma.account.update({
      where: {
        email,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });
  }

  async changeStatus(email: string, status: AccountStatus): Promise<Account> {
    return this.prisma.account.update({
      where: {
        email,
      },
      data: {
        profile: {
          update: {
            status,
          },
        },
      },
    });
  }

  async getProfile(accountId: number): Promise<Profile> {
    const profile = await this.prisma.account
      .findUnique({
        where: {
          id: accountId,
        },
      })
      .profile();

    if (!profile) {
      throw new Error(this.i18n.t('errors.profileNotFound'));
    }

    return profile;
  }
}

import { Injectable } from '@nestjs/common';
import PrismaClient from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { TotpService } from '@/app/auth/totp/totp.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AccountSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly totpService: TotpService,
  ) {}

  public async createAccountSession(
    accountId: number,
    token: string,
    ipAddr: string,
    userAgent?: string,
    totpToken?: string,
  ): Promise<PrismaClient.AccountSession> {
    const profile = await this.prisma.account
      .findUnique({
        where: {
          id: accountId,
        },
      })
      .profile();

    if (profile?.totpEnabled) {
      if (!totpToken) {
        throw new Error(this.i18n.t('errors.invalidToken'));
      }
      if (!profile.totpSecret) {
        throw new Error(this.i18n.t('errors.totpTokenNotSet'));
      }
      const isTokenValid = this.totpService.verifyToken(
        profile.totpSecret,
        totpToken,
      );

      if (!isTokenValid) {
        throw new Error(this.i18n.t('errors.invalidToken'));
      }
    }

    // eslint-disable-next-line no-magic-numbers
    const expiresAtInMs = Date.now() + 1000 * 60 * 60 * 24 * 30;
    return this.prisma.accountSession.create({
      data: {
        account: {
          connect: {
            id: accountId,
          },
        },
        token,
        ipAddr,
        userAgent,
        expiresAt: new Date(expiresAtInMs),
      },
    });
  }

  async getAccountSessionByToken(
    token: string,
  ): Promise<AccountSession | undefined> {
    const result = await this.prisma.accountSession.findUnique({
      where: {
        token,
      },
    });
    return result || undefined;
  }

  async getAccountByToken(token: string): Promise<Account | undefined> {
    const result = await this.prisma.accountSession.findUnique({
      where: {
        token,
      },
      select: {
        account: true,
      },
    });

    return result?.account;
  }

  async deleteSessions(
    account: Account,
    sessionIds: number[],
  ): Promise<boolean> {
    await this.prisma.accountSession.deleteMany({
      where: {
        account: {
          id: account.id,
        },
        id: {
          in: sessionIds,
        },
      },
    });
    return true;
  }

  async getSessions(account: Account): Promise<Array<AccountSession>> {
    return this.prisma.accountSession.findMany({
      where: {
        account: {
          id: account.id,
        },
      },
    });
  }

  async getAccount(accountSession: AccountSession): Promise<Account> {
    const result = await this.prisma.accountSession
      .findUnique({
        where: {
          id: accountSession.id,
        },
      })
      .account();

    if (!result) {
      throw new Error(this.i18n.t('errors.accountNotFound'));
    }
    return result;
  }
}

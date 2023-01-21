import { Injectable } from '@nestjs/common';
import PrismaClient from '@prisma/client';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountSession } from '@/@generated/nestgraphql/account-session/account-session.model';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AccountSessionService {
  constructor(private prisma: PrismaService) {}

  public async createAccountSession(
    accountId: number,
    token: string,
    ipAddr: string,
    userAgent?: string,
  ): Promise<PrismaClient.AccountSession> {
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
      throw new Error('Account not found');
    }
    return result;
  }
}

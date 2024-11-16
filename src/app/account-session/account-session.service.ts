import { InjectQueue, Process, Processor } from '@nestjs/bull';
import PrismaClient from '@prisma/client';
import { Job, Queue } from 'bull';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Account } from '@/app/account/types/account.object-type';
import { AccountSession } from '@/app/account-session/types/account-session.object-type';
import { TotpService } from '@/app/auth/totp/totp.service';
import { PrismaService } from '@/common/prisma/prisma.service';

interface ProcessAccountSessionParameters {
  sessionId: number;
}

@Processor('account-session')
export class AccountSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly totpService: TotpService,
    @InjectQueue('account-session')
    private readonly accountSessionQueue: Queue<ProcessAccountSessionParameters>,
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

    const session = await this.prisma.accountSession.create({
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

    await this.addDeleteSessionJob(session.id, new Date(expiresAtInMs));

    return session;
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

  @Process()
  async processAccountSession(
    job: Job<ProcessAccountSessionParameters>,
  ): Promise<void> {
    const { data } = job;
    await this.prisma.accountSession.delete({
      where: {
        id: data.sessionId,
      },
    });
  }

  async addDeleteSessionJob(
    sessionId: number,
    runAt: Date,
  ): Promise<Job<ProcessAccountSessionParameters>> {
    return await this.accountSessionQueue.add(
      {
        sessionId,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        delay: runAt.getTime() - Date.now(),
      },
    );
  }
}

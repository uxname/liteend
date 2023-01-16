import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import PrismaClient from '@prisma/client';

@Injectable()
export class AccountSessionService {
  constructor(private prisma: PrismaService) {}

  public async createAccountSession(
    accountId: number,
    token: string,
    ipAddr: string,
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
        expiresAt: new Date(expiresAtInMs),
      },
    });
  }
}

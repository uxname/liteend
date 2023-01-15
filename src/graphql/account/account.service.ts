import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { EasyconfigService } from 'nestjs-easyconfig';
import { CryptoService } from '@/common/crypto/crypto.service';
import { AccountRole, AccountStatus } from '@/graphql/account/types';
import Prisma from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private config: EasyconfigService,
    private crypto: CryptoService,
  ) {}

  public async createAccount(
    email: string,
    password: string,
  ): Promise<Prisma.Account> {
    const salt = this.config.get('SALT');
    const passwordHash = await this.crypto.hash(password, salt);
    return await this.prisma.account.create({
      data: {
        email,
        passwordHash,
        status: AccountStatus.ACTIVE,
        rolesArrayJson: JSON.stringify([AccountRole.USER]),
      },
    });
  }
}

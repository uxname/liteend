import { Injectable } from '@nestjs/common';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';
import { AccountStatus } from '@/@generated/nestgraphql/prisma/account-status.enum';
import { UpdateAccountInput } from '@/app/graphql/account/types';
import { CryptoService } from '@/common/crypto/crypto.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) {}

  public async createAccount(
    email: string,
    password: string,
    status: AccountStatus = AccountStatus.ACTIVE,
  ): Promise<Account> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const salt = process.env.SALT!;
    const passwordHash = await this.crypto.hash(password, salt);
    return this.prisma.account.create({
      data: {
        email,
        passwordHash,
        status,
        roles: [AccountRole.USER],
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const salt = process.env.SALT!;

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
        status,
      },
    });
  }

  updateAccount(account: Account, input: UpdateAccountInput) {
    return this.prisma.account.update({
      where: {
        id: account.id,
      },
      data: input,
    });
  }
}

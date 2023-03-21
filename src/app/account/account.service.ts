import { Injectable } from '@nestjs/common';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';
import { AccountStatus } from '@/@generated/nestgraphql/prisma/account-status.enum';
import { AccountGateway } from '@/app/account/account.gateway';
import { UpdateAccountInput } from '@/app/account/types';
import { CryptoService } from '@/common/crypto/crypto.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly accountGateway: AccountGateway,
  ) {}

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

  async updateAccount(account: Account, input: UpdateAccountInput) {
    await this.accountGateway.sendToAccount(
      account.id,
      'accountUpdated',
      input,
    );
    return this.prisma.account.update({
      where: {
        id: account.id,
      },
      data: input,
    });
  }
}

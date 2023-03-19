import process from 'node:process';

import { Injectable } from '@nestjs/common';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { CryptoService } from '@/common/crypto/crypto.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const salt = process.env.SALT!;
      const isPasswordValid = await this.cryptoService.hashVerify(
        password,
        salt,
        account.passwordHash,
      );

      if (isPasswordValid) {
        return account;
      } else {
        throw new Error('Invalid password');
      }
    } else {
      throw new Error('Account not found');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';

import { Account } from '@/@generated/nestgraphql/account/account.model';
import { CryptoService } from '@/common/crypto/crypto.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: EasyconfigService,
    private cryptoService: CryptoService,
  ) {}

  async validateAccount(email: string, password: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: {
        email,
      },
    });
    if (account) {
      const salt = this.config.get('SALT');
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

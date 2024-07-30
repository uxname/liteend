import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { Account } from '@/@generated/nestgraphql/account/account.model';
import { Profile } from '@/@generated/nestgraphql/profile/profile.model';
import { ProfileUpdateInput } from '@/@generated/nestgraphql/profile/profile-update.input';
import { AccountGateway } from '@/app/account/account.gateway';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly accountGateway: AccountGateway,
  ) {}

  async updateProfile(
    profileId: number,
    input: ProfileUpdateInput,
  ): Promise<Profile> {
    const result = await this.prismaService.profile.update({
      where: {
        id: profileId,
      },
      data: input,
      include: {
        accounts: true,
      },
    });

    for (const account of result.accounts) {
      await this.accountGateway.sendToAccount(
        account.id,
        'profileUpdated',
        input,
      );
    }

    return result;
  }

  async getAccounts(profileId: number): Promise<Array<Account>> {
    const result = await this.prismaService.profile
      .findUnique({
        where: {
          id: profileId,
        },
      })
      .accounts();

    if (!result) {
      throw new Error(this.i18n.t('errors.accountsNotFound'));
    }

    return result;
  }
}

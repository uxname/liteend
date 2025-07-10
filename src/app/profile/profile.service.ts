import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/@generated/i18n-types';
import { AccountGateway } from '@/app/account/account.gateway';
import { Account } from '@/app/account/types/account.object-type';
import { Profile } from '@/app/profile/types/profile.object-type';
import { ProfileUpdateInput } from '@/app/profile/types/profile-update.input';
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
    // Update profile and include associated accounts
    const result = await this.prismaService.profile.update({
      where: {
        id: profileId,
      },
      data: input,
      include: {
        accounts: true,
      },
    });

    // Send update notifications to all accounts concurrently
    await Promise.all(
      result.accounts.map((account) =>
        this.accountGateway.sendToAccount(account.id, 'profileUpdated', input),
      ),
    );

    return result;
  }

  async getAccounts(profileId: number): Promise<Account[]> {
    const profile = await this.prismaService.profile.findUnique({
      where: { id: profileId },
      include: { accounts: true }, // Make sure accounts are fetched
    });

    // Throw NotFoundException if profile or accounts are not found
    if (!profile || profile.accounts.length === 0) {
      throw new NotFoundException(this.i18n.t('errors.accountsNotFound'));
    }

    return profile.accounts;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '@/@generated/prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ProfileUpdateInput } from './types/profile-update.input';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(id: number, input: ProfileUpdateInput): Promise<Profile> {
    this.logger.log({ msg: 'Updating profile', profileId: id });
    return this.prisma.profile.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }
}

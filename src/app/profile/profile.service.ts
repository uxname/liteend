import { Injectable } from '@nestjs/common';
import { Profile } from '@/app/profile/types/profile.object-type';
import { ProfileUpdateInput } from '@/app/profile/types/profile-update.input';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateProfile(
    oidcSub: string,
    input: ProfileUpdateInput,
  ): Promise<Profile> {
    return this.prismaService.profile.update({
      where: {
        oidcSub,
      },
      data: input,
    });
  }
}

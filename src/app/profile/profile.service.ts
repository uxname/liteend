import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ProfileUpdateInput } from './types/profile-update.input';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(id: number, input: ProfileUpdateInput): Promise<Profile> {
    return this.prisma.profile.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }
}

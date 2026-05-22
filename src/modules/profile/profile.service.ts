import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '@/@generated/prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { ProfileUpdateInput } from './types/profile-update.input';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async updateProfile(id: number, input: ProfileUpdateInput): Promise<Profile> {
    this.logger.log({ msg: 'Updating profile', profileId: id });
    const updated = await this.prisma.profile.update({
      where: { id },
      data: {
        ...input,
      },
    });
    await this.redis
      .getClient()
      .del(`profile:sub:${updated.oidcSub}`)
      .catch(() => {});
    return updated;
  }
}

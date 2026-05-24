import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '@/@generated/prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { ProfileUpdateInput } from './types/profile-update.input';

const CACHE_TTL = 3600;

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
      .set(
        `profile:sub:${updated.oidcSub}`,
        JSON.stringify(updated),
        'EX',
        CACHE_TTL,
      )
      .catch((err) => {
        this.logger.warn({ msg: 'Redis cache write failed', err });
      });
    return updated;
  }
}

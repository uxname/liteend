import { Injectable } from '@nestjs/common';
import { ProfileRole } from '@/@generated/prisma/enums';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findOrCreateProfile(oidcSub: string) {
    const cached = await this.redis.getClient().get(`profile:sub:${oidcSub}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const profile = await this.prisma.profile.upsert({
      where: { oidcSub },
      create: { oidcSub },
      update: {},
    });

    await this.redis
      .getClient()
      .set(`profile:sub:${oidcSub}`, JSON.stringify(profile), 'EX', 300)
      .catch(() => {});

    return profile;
  }

  async findProfileBySub(oidcSub: string) {
    const cached = await this.redis.getClient().get(`profile:sub:${oidcSub}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const profile = await this.prisma.profile.findUnique({
      where: { oidcSub },
    });

    if (profile) {
      await this.redis
        .getClient()
        .set(`profile:sub:${oidcSub}`, JSON.stringify(profile), 'EX', 300)
        .catch(() => {});
    }

    return profile;
  }

  async findOrCreateDefaultMockUser() {
    return this.prisma.profile.upsert({
      where: { oidcSub: 'mock-oidc-sub' },
      create: {
        oidcSub: 'mock-oidc-sub',
        roles: [ProfileRole.USER, ProfileRole.ADMIN],
        avatarUrl: 'https://i.pravatar.cc/300',
      },
      update: {
        roles: [ProfileRole.USER, ProfileRole.ADMIN],
        avatarUrl: 'https://i.pravatar.cc/300',
      },
    });
  }
}

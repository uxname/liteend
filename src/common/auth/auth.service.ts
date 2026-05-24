import { Injectable, Logger } from '@nestjs/common';
import { ProfileRole } from '@/@generated/prisma/enums';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';

const CACHE_TTL = 3600;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findOrCreateProfile(oidcSub: string) {
    const cached = await this.redis.getClient().get(`profile:sub:${oidcSub}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        this.logger.warn({
          msg: 'Invalid JSON in Redis cache, re-fetching',
          oidcSub,
        });
        await this.redis
          .getClient()
          .del(`profile:sub:${oidcSub}`)
          .catch(() => {});
      }
    }

    const profile = await this.prisma.profile.upsert({
      where: { oidcSub },
      create: { oidcSub },
      update: {},
    });

    this.logger.log({
      msg: 'Profile found or created',
      oidcSub,
      profileId: profile.id,
    });

    await this.redis
      .getClient()
      .set(`profile:sub:${oidcSub}`, JSON.stringify(profile), 'EX', CACHE_TTL)
      .catch((err) => {
        this.logger.warn({ msg: 'Redis cache set failed', err });
      });

    return profile;
  }

  async findProfileBySub(oidcSub: string) {
    const cached = await this.redis.getClient().get(`profile:sub:${oidcSub}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        this.logger.warn({
          msg: 'Invalid JSON in Redis cache, re-fetching',
          oidcSub,
        });
        await this.redis
          .getClient()
          .del(`profile:sub:${oidcSub}`)
          .catch(() => {});
      }
    }

    const profile = await this.prisma.profile.findUnique({
      where: { oidcSub },
    });

    if (profile) {
      this.logger.log({
        msg: 'Profile found by sub',
        oidcSub,
        profileId: profile.id,
      });
      await this.redis
        .getClient()
        .set(`profile:sub:${oidcSub}`, JSON.stringify(profile), 'EX', CACHE_TTL)
        .catch((err) => {
          this.logger.warn({ msg: 'Redis cache set failed', err });
        });
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

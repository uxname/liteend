import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Profile, ProfileRole } from '@/@generated/prisma/client';
import { JwtStrategy } from '@/common/auth/jwt.strategy';
import { PrismaService } from '@/common/prisma/prisma.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockPrismaService = {
    profile: {
      upsert: vi.fn(),
    },
  };

  const mockConfigService = {
    getOrThrow: vi.fn((key: string) => {
      const config: Record<string, string> = {
        OIDC_ISSUER: 'https://issuer.example.com',
        OIDC_AUDIENCE: 'audience',
        OIDC_JWKS_URI: 'https://issuer.example.com/.well-known/jwks.json',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    vi.mock('jwks-rsa', () => ({
      passportJwtSecret: vi.fn(() => () => 'test-secret'),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user profile from upsert', async () => {
      const payload = {
        sub: 'oauth2|12345',
        iss: 'https://issuer.example.com',
        aud: 'audience',
      };

      const mockProfile: Profile = {
        id: 1,
        oidcSub: 'oauth2|12345',
        roles: [ProfileRole.USER],
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.upsert.mockResolvedValue(mockProfile);

      const result = await strategy.validate(payload);

      expect(mockPrismaService.profile.upsert).toHaveBeenCalledWith({
        where: { oidcSub: 'oauth2|12345' },
        create: { oidcSub: 'oauth2|12345' },
        update: {},
      });
      expect(result).toEqual(mockProfile);
    });

    it('should throw UnauthorizedException if sub is missing', async () => {
      const payload = {
        sub: '',
        iss: 'https://issuer.example.com',
        aud: 'audience',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Token has no subject (sub)'),
      );
    });

    it('should handle roles from payload', async () => {
      const payload = {
        sub: 'oauth2|12345',
        iss: 'https://issuer.example.com',
        aud: 'audience',
        roles: ['ADMIN', 'USER'],
      };

      const mockProfile: Profile = {
        id: 1,
        oidcSub: 'oauth2|12345',
        roles: [ProfileRole.USER, ProfileRole.ADMIN],
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.upsert.mockResolvedValue(mockProfile);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockProfile);
    });
  });
});

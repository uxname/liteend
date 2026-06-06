import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Profile, ProfileRole } from '@/@generated/prisma/client';
import { AuthService } from '@/common/auth/auth.service';
import { JwtStrategy } from '@/common/auth/jwt.strategy';

vi.mock('jwks-rsa', () => ({
  passportJwtSecret: vi.fn(() => () => 'test-secret'),
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockAuthService = {
    findOrCreateProfile: vi.fn(),
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user profile from auth service', async () => {
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
        displayName: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.findOrCreateProfile.mockResolvedValue(mockProfile);

      const result = await strategy.validate(payload);

      expect(mockAuthService.findOrCreateProfile).toHaveBeenCalledWith(
        'oauth2|12345',
      );
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
        displayName: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.findOrCreateProfile.mockResolvedValue(mockProfile);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockProfile);
    });
  });
});

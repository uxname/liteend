import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Profile, ProfileRole } from '@/@generated/prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { createExecutionContextMock } from '../../../test/utils/mocks';

vi.mock('@nestjs/passport', () => {
  class PassportAuthGuard {
    async canActivate(_ctx: unknown): Promise<boolean> {
      return true;
    }
  }
  return { AuthGuard: vi.fn().mockReturnValue(PassportAuthGuard) };
});

import { JwtAuthGuard } from './jwt-auth.guard';

const makeProfile = (partial: Partial<Profile> = {}): Profile => ({
  id: 1,
  oidcSub: 'mock-oidc-sub',
  roles: [ProfileRole.USER],
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...partial,
});

const makeHttp = (req: unknown) => ({
  getRequest: vi.fn().mockReturnValue(req),
  getResponse: vi.fn(),
  getNext: vi.fn(),
});

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let configService: ConfigService;
  let prisma: PrismaService;
  let logger: PinoLogger;

  beforeEach(() => {
    configService = {
      get: vi.fn(),
      getOrThrow: vi.fn(),
    } as unknown as ConfigService;
    prisma = {
      profile: { findUnique: vi.fn(), upsert: vi.fn() },
    } as unknown as PrismaService;
    logger = { setContext: vi.fn(), assign: vi.fn() } as unknown as PinoLogger;
    guard = new JwtAuthGuard(configService, prisma, logger);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('canActivate — mock mode with x-mock-sub', () => {
    it('should find user by oidcSub and return true', async () => {
      vi.mocked(configService.get).mockReturnValue('true');
      const profile = makeProfile();
      vi.mocked(prisma.profile.findUnique).mockResolvedValue(profile);

      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('http');
      ctx.switchToHttp.mockReturnValue(
        makeHttp({ headers: { 'x-mock-sub': 'some-sub' } }),
      );

      const result = await guard.canActivate(ctx as never);
      expect(result).toBe(true);
      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { oidcSub: 'some-sub' },
      });
    });

    it('should fall through to default user when findUnique returns null', async () => {
      vi.mocked(configService.get).mockReturnValue('true');
      vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);
      const defaultProfile = makeProfile();
      vi.mocked(prisma.profile.upsert).mockResolvedValue(defaultProfile);

      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('http');
      ctx.switchToHttp.mockReturnValue(
        makeHttp({ headers: { 'x-mock-sub': 'unknown-sub' } }),
      );

      const result = await guard.canActivate(ctx as never);
      expect(result).toBe(true);
      expect(prisma.profile.upsert).toHaveBeenCalled();
    });

    it('should sync user to req.raw when it exists', async () => {
      vi.mocked(configService.get).mockReturnValue('true');
      const profile = makeProfile();
      vi.mocked(prisma.profile.findUnique).mockResolvedValue(profile);

      const raw: Record<string, unknown> = {};
      const req = { headers: { 'x-mock-sub': 'some-sub' }, raw };
      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('http');
      ctx.switchToHttp.mockReturnValue(makeHttp(req));

      await guard.canActivate(ctx as never);
      expect(raw.user).toEqual(profile);
    });
  });

  describe('canActivate — mock mode without x-mock-sub', () => {
    it('should upsert default user and return true', async () => {
      vi.mocked(configService.get).mockReturnValue('true');
      const profile = makeProfile();
      vi.mocked(prisma.profile.upsert).mockResolvedValue(profile);

      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('http');
      ctx.switchToHttp.mockReturnValue(makeHttp({ headers: {} }));

      const result = await guard.canActivate(ctx as never);
      expect(result).toBe(true);
      expect(prisma.profile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { oidcSub: 'mock-oidc-sub' } }),
      );
    });
  });

  describe('canActivate — JWT mode (mock disabled)', () => {
    it('should delegate to parent canActivate and sync user when result is true', async () => {
      vi.mocked(configService.get).mockReturnValue('false');

      const parentProto = Object.getPrototypeOf(JwtAuthGuard.prototype) as {
        canActivate: () => Promise<boolean>;
      };
      const parentSpy = vi
        .spyOn(parentProto, 'canActivate')
        .mockResolvedValue(true);

      const profile = makeProfile();
      const req = { user: profile, headers: {} };
      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('http');
      ctx.switchToHttp.mockReturnValue(makeHttp(req));

      const result = await guard.canActivate(ctx as never);
      expect(result).toBe(true);
      parentSpy.mockRestore();
    });
  });

  describe('getRequest', () => {
    it('should return HTTP request', () => {
      const req = { url: '/test' };
      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('http');
      ctx.switchToHttp.mockReturnValue(makeHttp(req));

      expect(guard.getRequest(ctx as never)).toEqual(req);
    });

    it('should return GraphQL request from context', () => {
      const req = { url: '/graphql' };
      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('graphql');

      const gqlCtx = { getContext: vi.fn().mockReturnValue({ req }) };
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

      expect(guard.getRequest(ctx as never)).toEqual(req);
    });

    it('should throw UnauthorizedException when graphql context has no req', () => {
      const ctx = createExecutionContextMock();
      ctx.getType.mockReturnValue('graphql');

      const gqlCtx = { getContext: vi.fn().mockReturnValue({}) };
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

      expect(() => guard.getRequest(ctx as never)).toThrow(
        UnauthorizedException,
      );
    });
  });
});

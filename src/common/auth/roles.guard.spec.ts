import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileRole } from '@/@generated/prisma/client';
import { RolesGuard } from '@/common/auth/roles.guard';

interface MockGqlContext {
  getContext: ReturnType<typeof vi.fn>;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: vi.fn(),
    } as unknown as Reflector;
    guard = new RolesGuard(reflector);
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const mockContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        getType: vi.fn().mockReturnValue('http'),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi
            .fn()
            .mockReturnValue({ user: { roles: [ProfileRole.USER] } }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        ProfileRole.USER,
      ]);

      const mockGqlContext: MockGqlContext = {
        getContext: vi.fn().mockReturnValue({
          req: { user: { roles: [ProfileRole.USER] } },
        }),
      };
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(
        mockGqlContext as unknown as GqlExecutionContext,
      );

      const mockContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        getType: vi.fn().mockReturnValue('graphql'),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi
            .fn()
            .mockReturnValue({ user: { roles: [ProfileRole.USER] } }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        ProfileRole.ADMIN,
      ]);

      const mockGqlContext: MockGqlContext = {
        getContext: vi.fn().mockReturnValue({
          req: { user: { roles: [ProfileRole.USER] } },
        }),
      };
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(
        mockGqlContext as unknown as GqlExecutionContext,
      );

      const mockContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        getType: vi.fn().mockReturnValue('graphql'),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi
            .fn()
            .mockReturnValue({ user: { roles: [ProfileRole.USER] } }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(false);
    });

    it('should return false when user has no roles', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        ProfileRole.ADMIN,
      ]);

      const mockGqlContext: MockGqlContext = {
        getContext: vi.fn().mockReturnValue({
          req: { user: { roles: [] } },
        }),
      };
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(
        mockGqlContext as unknown as GqlExecutionContext,
      );

      const mockContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        getType: vi.fn().mockReturnValue('graphql'),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({ user: { roles: [] } }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(false);
    });

    it('should return false when user is undefined', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        ProfileRole.ADMIN,
      ]);

      const mockGqlContext: MockGqlContext = {
        getContext: vi.fn().mockReturnValue({
          req: { user: undefined },
        }),
      };
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(
        mockGqlContext as unknown as GqlExecutionContext,
      );

      const mockContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        getType: vi.fn().mockReturnValue('graphql'),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({ user: undefined }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(false);
    });

    it('should return true when user has one of required roles', () => {
      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        ProfileRole.ADMIN,
        ProfileRole.USER,
      ]);

      const mockGqlContext: MockGqlContext = {
        getContext: vi.fn().mockReturnValue({
          req: { user: { roles: [ProfileRole.USER] } },
        }),
      };
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(
        mockGqlContext as unknown as GqlExecutionContext,
      );

      const mockContext = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        getType: vi.fn().mockReturnValue('graphql'),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi
            .fn()
            .mockReturnValue({ user: { roles: [ProfileRole.USER] } }),
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });
});

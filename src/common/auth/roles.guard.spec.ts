import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileRole } from '@/@generated/prisma/client';
import { RolesGuard } from '@/common/auth/roles.guard';
import { createExecutionContextMock, mock } from '../../../test/utils/mocks';

const buildHttpExecutionContext = (user: {
  roles?: ProfileRole[] | undefined;
}) => {
  const context = createExecutionContextMock();
  context.getType.mockReturnValue('http');
  context.switchToHttp.mockReturnValue({
    getRequest: vi.fn().mockReturnValue({ user }),
    getResponse: vi.fn(),
    getNext: vi.fn(),
  });
  context.getHandler.mockReturnValue(vi.fn());
  context.getClass.mockReturnValue(vi.fn());
  return context;
};

const buildGraphQLExecutionContext = (user: {
  roles?: ProfileRole[] | undefined;
}) => {
  const context = createExecutionContextMock();
  context.getType.mockReturnValue('graphql');
  context.switchToHttp.mockReturnValue({
    getRequest: vi.fn().mockReturnValue({ user }),
    getResponse: vi.fn(),
    getNext: vi.fn(),
  });
  context.getHandler.mockReturnValue(vi.fn());
  context.getClass.mockReturnValue(vi.fn());
  return context;
};

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = mock<Reflector>();
    guard = new RolesGuard(reflector);
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      vi.mocked(reflector.getAllAndOverride).mockReturnValue(undefined);

      const mockContext = buildHttpExecutionContext({
        roles: [ProfileRole.USER],
      });

      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should return true when user has required role', () => {
      vi.mocked(reflector.getAllAndOverride).mockReturnValue([
        ProfileRole.USER,
      ]);

      const gqlContext = mock<GqlExecutionContext>();
      gqlContext.getContext.mockReturnValue({
        req: { user: { roles: [ProfileRole.USER] } },
      });
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext);

      const mockContext = buildGraphQLExecutionContext({
        roles: [ProfileRole.USER],
      });

      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      vi.mocked(reflector.getAllAndOverride).mockReturnValue([
        ProfileRole.ADMIN,
      ]);

      const gqlContext = mock<GqlExecutionContext>();
      gqlContext.getContext.mockReturnValue({
        req: { user: { roles: [ProfileRole.USER] } },
      });
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext);

      const mockContext = buildGraphQLExecutionContext({
        roles: [ProfileRole.USER],
      });

      expect(guard.canActivate(mockContext)).toBe(false);
    });

    it('should return false when user has no roles', () => {
      vi.mocked(reflector.getAllAndOverride).mockReturnValue([
        ProfileRole.ADMIN,
      ]);

      const gqlContext = mock<GqlExecutionContext>();
      gqlContext.getContext.mockReturnValue({
        req: { user: { roles: [] } },
      });
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext);

      const mockContext = buildGraphQLExecutionContext({ roles: [] });

      expect(guard.canActivate(mockContext)).toBe(false);
    });

    it('should return false when user is undefined', () => {
      vi.mocked(reflector.getAllAndOverride).mockReturnValue([
        ProfileRole.ADMIN,
      ]);

      const gqlContext = mock<GqlExecutionContext>();
      gqlContext.getContext.mockReturnValue({
        req: { user: undefined },
      });
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext);

      const mockContext = buildGraphQLExecutionContext({ roles: undefined });

      expect(guard.canActivate(mockContext)).toBe(false);
    });

    it('should return true when user has one of required roles', () => {
      vi.mocked(reflector.getAllAndOverride).mockReturnValue([
        ProfileRole.ADMIN,
        ProfileRole.USER,
      ]);

      const gqlContext = mock<GqlExecutionContext>();
      gqlContext.getContext.mockReturnValue({
        req: { user: { roles: [ProfileRole.USER] } },
      });
      vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlContext);

      const mockContext = buildGraphQLExecutionContext({
        roles: [ProfileRole.USER],
      });

      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });
});

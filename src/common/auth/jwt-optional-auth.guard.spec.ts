import { describe, expect, it, vi } from 'vitest';

vi.mock('@nestjs/passport', () => {
  class PassportAuthGuard {
    async canActivate(_ctx: unknown): Promise<boolean> {
      return true;
    }
  }
  return { AuthGuard: vi.fn().mockReturnValue(PassportAuthGuard) };
});

import { JwtOptionalAuthGuard } from './jwt-optional-auth.guard';

const makeGuard = () => {
  const logger = { setContext: vi.fn(), assign: vi.fn() } as never;
  const g = new (class extends JwtOptionalAuthGuard {
    testHandleRequest(err: unknown, user: unknown) {
      return this.handleRequest(err, user);
    }
  })({} as never, {} as never, logger);
  return g;
};

describe('JwtOptionalAuthGuard', () => {
  describe('handleRequest', () => {
    it('should return null when user is falsy', () => {
      const guard = makeGuard();
      expect(guard.testHandleRequest(null, null)).toBeNull();
      expect(guard.testHandleRequest(null, undefined)).toBeNull();
      expect(guard.testHandleRequest(null, false)).toBeNull();
    });

    it('should return user when user is present', () => {
      const guard = makeGuard();
      const user = { id: 1, roles: [] };
      expect(guard.testHandleRequest(null, user)).toEqual(user);
    });

    it('should return null when err is present (instead of throwing)', () => {
      const guard = makeGuard();
      expect(
        guard.testHandleRequest(new Error('auth failed'), null),
      ).toBeNull();
    });
  });
});

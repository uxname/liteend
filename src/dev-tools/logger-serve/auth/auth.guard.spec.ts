import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createExecutionContextMock, mock } from '../../../../test/utils/mocks';
import { AuthGuard } from './auth.guard';

const VALID_USER = 'admin';
const VALID_PASS = 'secret';

const makeConfigService = () => {
  const svc = mock<ConfigService>();
  svc.getOrThrow = vi.fn((key: string) => {
    if (key === 'LOGS_ADMIN_PANEL_USER') return VALID_USER;
    if (key === 'LOGS_ADMIN_PANEL_PASSWORD') return VALID_PASS;
    throw new Error(`Unknown config key: ${key}`);
  });
  return svc;
};

const buildContext = (authHeader: string | undefined) => {
  const ctx = createExecutionContextMock();
  const response = { header: vi.fn() };
  ctx.switchToHttp.mockReturnValue({
    getRequest: vi.fn().mockReturnValue({
      headers: authHeader !== undefined ? { authorization: authHeader } : {},
    }),
    getResponse: vi.fn().mockReturnValue(response),
    getNext: vi.fn(),
  });
  return ctx;
};

const encodeBasic = (user: string, pass: string) =>
  `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;

describe('AuthGuard (logger-serve Basic Auth)', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard(makeConfigService());
  });

  it('should throw UnauthorizedException when Authorization header is missing', () => {
    const ctx = buildContext(undefined);
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for non-Basic auth scheme', () => {
    const ctx = buildContext('Bearer some-jwt-token');
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for wrong password', () => {
    const ctx = buildContext(encodeBasic(VALID_USER, 'wrongpass'));
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for wrong username', () => {
    const ctx = buildContext(encodeBasic('hacker', VALID_PASS));
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should return true for valid credentials', () => {
    const ctx = buildContext(encodeBasic(VALID_USER, VALID_PASS));
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should throw UnauthorizedException (not TypeError) for credentials without colon', () => {
    const ctx = buildContext(
      `Basic ${Buffer.from('nocolon').toString('base64')}`,
    );
    let thrownError: unknown;
    try {
      guard.canActivate(ctx);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeInstanceOf(UnauthorizedException);
    expect(thrownError).not.toBeInstanceOf(TypeError);
  });
});

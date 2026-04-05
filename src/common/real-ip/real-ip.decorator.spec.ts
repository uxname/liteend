import { GqlExecutionContext } from '@nestjs/graphql';
import { describe, expect, it, vi } from 'vitest';
import { createExecutionContextMock } from '../../../test/utils/mocks';
import { realIpFactory } from './real-ip.decorator';

const makeHttp = (req: unknown) => ({
  getRequest: vi.fn().mockReturnValue(req),
  getResponse: vi.fn(),
  getNext: vi.fn(),
});

describe('RealIp decorator', () => {
  it('should return req.ip when present (HTTP)', () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('http');
    ctx.switchToHttp.mockReturnValue(makeHttp({ ip: '10.0.0.1', headers: {} }));

    expect(realIpFactory(undefined, ctx as never)).toBe('10.0.0.1');
  });

  it('should extract from x-forwarded-for header (HTTP, no ip)', () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('http');
    ctx.switchToHttp.mockReturnValue(
      makeHttp({ headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' } }),
    );

    expect(realIpFactory(undefined, ctx as never)).toBe('192.168.1.1');
  });

  it('should extract from x-forwarded-for array (HTTP)', () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('http');
    ctx.switchToHttp.mockReturnValue(
      makeHttp({ headers: { 'x-forwarded-for': ['1.2.3.4', '5.6.7.8'] } }),
    );

    expect(realIpFactory(undefined, ctx as never)).toBe('1.2.3.4');
  });

  it('should return 127.0.0.1 as fallback (HTTP)', () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('http');
    ctx.switchToHttp.mockReturnValue(makeHttp({ headers: {} }));

    expect(realIpFactory(undefined, ctx as never)).toBe('127.0.0.1');
  });

  it('should return ip from GraphQL context', () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const gqlCtx = {
      getContext: vi
        .fn()
        .mockReturnValue({ req: { ip: '9.9.9.9', headers: {} } }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    expect(realIpFactory(undefined, ctx as never)).toBe('9.9.9.9');
  });
});

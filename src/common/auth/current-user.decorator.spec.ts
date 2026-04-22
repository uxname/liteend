import type { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createExecutionContextMock } from '../../../test/utils/mocks';
import { CurrentUser } from './current-user.decorator';

// vi.mock hoisting doesn't work for @nestjs/common with SWC; use Reflect metadata instead
const ROUTE_ARGS_METADATA = '__routeArguments__';

class TestController {
  handler(@CurrentUser() _user: unknown) {}
}

const metadata = Reflect.getMetadata(
  ROUTE_ARGS_METADATA,
  TestController,
  'handler',
) as Record<
  string,
  { factory: (data: unknown, ctx: ExecutionContext) => unknown }
>;

const factory = Object.values(metadata)[0]!.factory;

describe('CurrentUser decorator', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return user from GraphQL context when req is present', () => {
    const mockUser = { id: 1, oidcSub: 'user-gql' };
    const ctx = createExecutionContextMock();

    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: vi.fn().mockReturnValue({ req: { user: mockUser } }),
    } as unknown as GqlExecutionContext);

    const result = factory(undefined, ctx);
    expect(result).toBe(mockUser);
  });

  it('should fall back to HTTP context when GraphQL req is null', () => {
    const mockUser = { id: 2, oidcSub: 'user-http' };
    const ctx = createExecutionContextMock();

    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: vi.fn().mockReturnValue({ req: null }),
    } as unknown as GqlExecutionContext);

    ctx.switchToHttp.mockReturnValue({
      getRequest: vi.fn().mockReturnValue({ user: mockUser }),
      getResponse: vi.fn(),
      getNext: vi.fn(),
    });

    const result = factory(undefined, ctx);
    expect(result).toBe(mockUser);
  });

  it('should return undefined when HTTP context has no user', () => {
    const ctx = createExecutionContextMock();

    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: vi.fn().mockReturnValue({ req: null }),
    } as unknown as GqlExecutionContext);

    ctx.switchToHttp.mockReturnValue({
      getRequest: vi.fn().mockReturnValue({ user: undefined }),
      getResponse: vi.fn(),
      getNext: vi.fn(),
    });

    const result = factory(undefined, ctx);
    expect(result).toBeUndefined();
  });
});

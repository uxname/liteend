import { GqlExecutionContext } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createExecutionContextMock } from '../../../test/utils/mocks';
import { GqlLoggingInterceptor } from './gql-logging.interceptor';

const makeLogger = () =>
  ({
    setContext: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    assign: vi.fn(),
  }) as unknown as PinoLogger;

const makeNext = (value: unknown = 'result') => ({
  handle: vi.fn().mockReturnValue(of(value)),
});

describe('GqlLoggingInterceptor', () => {
  let interceptor: GqlLoggingInterceptor;
  let logger: PinoLogger;

  beforeEach(() => {
    logger = makeLogger();
    interceptor = new GqlLoggingInterceptor(logger);
  });

  it('should pass through non-graphql (http) context unchanged', () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('http');
    const next = makeNext();

    interceptor.intercept(ctx as never, next);

    expect(next.handle).toHaveBeenCalled();
  });

  it('should pass through when req is missing in graphql context', () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const gqlCtx = {
      getInfo: vi
        .fn()
        .mockReturnValue({ parentType: { name: 'Query' }, fieldName: 'test' }),
      getArgs: vi.fn().mockReturnValue({}),
      getContext: vi.fn().mockReturnValue({ req: null }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    const next = makeNext();
    interceptor.intercept(ctx as never, next);

    expect(next.handle).toHaveBeenCalled();
  });

  it('should attach graphql metadata to request', async () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const req: Record<string, unknown> = {};
    const gqlCtx = {
      getInfo: vi.fn().mockReturnValue({
        parentType: { name: 'Query' },
        fieldName: 'getUser',
      }),
      getArgs: vi.fn().mockReturnValue({ id: 1 }),
      getContext: vi.fn().mockReturnValue({ req }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    const next = makeNext({ user: { id: 1 } });
    const obs = interceptor.intercept(ctx as never, next);

    await firstValueFrom(obs);
    expect(req.graphql).toBeDefined();
    expect((req.graphql as Record<string, unknown>).operation).toBe('getUser');
  });

  it('should set graphql error on error path', async () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const req: Record<string, unknown> = {};
    const gqlCtx = {
      getInfo: vi.fn().mockReturnValue({
        parentType: { name: 'Mutation' },
        fieldName: 'doThing',
      }),
      getArgs: vi.fn().mockReturnValue({}),
      getContext: vi.fn().mockReturnValue({ req }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    const next = {
      handle: vi.fn().mockReturnValue(throwError(() => new Error('oops'))),
    };
    const obs = interceptor.intercept(ctx as never, next);

    await expect(firstValueFrom(obs)).rejects.toThrow();
    expect((req.graphql as Record<string, unknown>).error).toBe('oops');
  });

  it('should redact sensitive keys from args', async () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const req: Record<string, unknown> = {};
    const gqlCtx = {
      getInfo: vi
        .fn()
        .mockReturnValue({ parentType: null, fieldName: 'login' }),
      getArgs: vi
        .fn()
        .mockReturnValue({ password: 'secret123', username: 'alice' }),
      getContext: vi.fn().mockReturnValue({ req }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    const next = makeNext(null);
    const obs = interceptor.intercept(ctx as never, next);

    await firstValueFrom(obs);
    const graphqlData = req.graphql as Record<string, unknown>;
    const args = graphqlData.args as Record<string, unknown>;
    expect(args.password).toBe('[REDACTED]');
    expect(args.username).toBe('alice');
  });

  it('should truncate large string responses', async () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const req: Record<string, unknown> = {};
    const gqlCtx = {
      getInfo: vi
        .fn()
        .mockReturnValue({ parentType: { name: 'Query' }, fieldName: 'big' }),
      getArgs: vi.fn().mockReturnValue({}),
      getContext: vi.fn().mockReturnValue({ req }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    const bigString = 'x'.repeat(5000);
    const next = makeNext(bigString);
    const obs = interceptor.intercept(ctx as never, next);

    await firstValueFrom(obs);
    const response = (req.graphql as Record<string, unknown>)
      .response as string;
    expect(response).toContain('...truncated');
    expect(response).toContain('5000 bytes total');
    expect(response.length).toBeLessThan(bigString.length);
  });

  it('should truncate arrays exceeding max elements', async () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const req: Record<string, unknown> = {};
    const gqlCtx = {
      getInfo: vi
        .fn()
        .mockReturnValue({ parentType: { name: 'Query' }, fieldName: 'list' }),
      getArgs: vi.fn().mockReturnValue({}),
      getContext: vi.fn().mockReturnValue({ req }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    const bigArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const next = makeNext(bigArray);
    const obs = interceptor.intercept(ctx as never, next);

    await firstValueFrom(obs);
    const response = (req.graphql as Record<string, unknown>)
      .response as unknown[];
    expect(response).toHaveLength(6); // 5 items + truncation marker
    expect(response[5]).toMatch(/\+5 items/);
  });

  it('should also sync graphql data to req.raw', async () => {
    const ctx = createExecutionContextMock();
    ctx.getType.mockReturnValue('graphql');

    const raw: Record<string, unknown> = {};
    const req: Record<string, unknown> = { raw };
    const gqlCtx = {
      getInfo: vi
        .fn()
        .mockReturnValue({ parentType: { name: 'Query' }, fieldName: 'me' }),
      getArgs: vi.fn().mockReturnValue({}),
      getContext: vi.fn().mockReturnValue({ req }),
    };
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(gqlCtx as never);

    const next = makeNext('me-result');
    const obs = interceptor.intercept(ctx as never, next);

    await firstValueFrom(obs);
    expect(raw.graphql).toBeDefined();
  });
});

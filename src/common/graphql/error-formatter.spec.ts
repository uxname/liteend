import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ZodValidationException } from 'nestjs-zod';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { gqlErrorFormatter } from './error-formatter';

const makeError = (original?: Error): GraphQLError =>
  new GraphQLError('msg', { originalError: original });

const makeContext = (id = 'req-1') => ({ req: { id } }) as never;

type FormattedError = Record<string, unknown>;
const formatted = (
  result: ReturnType<typeof gqlErrorFormatter>,
  index = 0,
): FormattedError =>
  result.response.errors![index] as unknown as FormattedError;

describe('gqlErrorFormatter', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 200 when there are no errors', () => {
    const result = gqlErrorFormatter({ data: { ok: true } }, makeContext());
    expect(result.statusCode).toBe(200);
    expect(result.response.errors).toBeUndefined();
  });

  it('should return 200 when errors array is empty', () => {
    const result = gqlErrorFormatter({ data: null, errors: [] }, makeContext());
    expect(result.statusCode).toBe(200);
  });

  it('should handle ZodValidationException', () => {
    const schema = z.object({ name: z.string() });
    const parsed = schema.safeParse({ name: 123 });
    const zodErr = new ZodValidationException(
      (parsed as { error: z.ZodError }).error,
    );
    const result = gqlErrorFormatter(
      { errors: [makeError(zodErr)] },
      makeContext(),
    );
    expect(result.statusCode).toBe(200);
    const f = formatted(result);
    expect(f.message).toBe('Validation Failed');
    expect((f.extensions as FormattedError).code).toBe('BAD_USER_INPUT');
  });

  it('should handle HttpException BAD_REQUEST', () => {
    const result = gqlErrorFormatter(
      {
        errors: [
          makeError(new HttpException('bad input', HttpStatus.BAD_REQUEST)),
        ],
      },
      makeContext(),
    );
    expect((formatted(result).extensions as FormattedError).code).toBe(
      'BAD_USER_INPUT',
    );
  });

  it('should handle HttpException UNAUTHORIZED', () => {
    const result = gqlErrorFormatter(
      { errors: [makeError(new UnauthorizedException())] },
      makeContext(),
    );
    expect((formatted(result).extensions as FormattedError).code).toBe(
      'UNAUTHENTICATED',
    );
  });

  it('should handle HttpException FORBIDDEN', () => {
    const result = gqlErrorFormatter(
      { errors: [makeError(new ForbiddenException())] },
      makeContext(),
    );
    expect((formatted(result).extensions as FormattedError).code).toBe(
      'FORBIDDEN',
    );
  });

  it('should handle HttpException NOT_FOUND', () => {
    const result = gqlErrorFormatter(
      { errors: [makeError(new NotFoundException())] },
      makeContext(),
    );
    expect((formatted(result).extensions as FormattedError).code).toBe(
      'NOT_FOUND',
    );
  });

  it('should handle HttpException 500 as server error', () => {
    const result = gqlErrorFormatter(
      {
        errors: [
          makeError(
            new HttpException('oops', HttpStatus.INTERNAL_SERVER_ERROR),
          ),
        ],
      },
      makeContext(),
    );
    expect((formatted(result).extensions as FormattedError).code).toBe(
      'INTERNAL_SERVER_ERROR',
    );
  });

  it('should handle mercurius persisted query not found error', () => {
    const originalError = Object.assign(new Error('not found'), {
      code: 'MER_ERR_GQL_PERSISTED_QUERY_NOT_FOUND',
    });
    const result = gqlErrorFormatter(
      { errors: [makeError(originalError)] },
      makeContext(),
    );
    const f = formatted(result);
    expect(f.message).toBe('Unknown query');
    expect((f.extensions as FormattedError).code).toBe('BAD_USER_INPUT');
  });

  it('should handle generic unhandled error', () => {
    const result = gqlErrorFormatter(
      { errors: [makeError(new Error('something went wrong'))] },
      makeContext(),
    );
    const f = formatted(result);
    expect(f.message).toBe('something went wrong');
    expect((f.extensions as FormattedError).code).toBe('INTERNAL_SERVER_ERROR');
  });

  it('should handle error with no originalError', () => {
    const result = gqlErrorFormatter(
      { errors: [new GraphQLError('raw graphql error')] },
      makeContext(),
    );
    expect(formatted(result).message).toBe('Internal Server Error');
  });

  it('should use unknown as requestId when req is missing', () => {
    const result = gqlErrorFormatter(
      { errors: [makeError(new Error('test'))] },
      {} as never,
    );
    expect((formatted(result).extensions as FormattedError).requestId).toBe(
      'unknown',
    );
  });
});

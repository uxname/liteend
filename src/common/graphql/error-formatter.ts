import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ExecutionResult } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { ZodValidationException } from 'nestjs-zod';
import { core, ZodError } from 'zod';
import { createDigestFromError } from '@/common/all-exceptions-filter';

const logger = new Logger('GraphQLErrorFormatter');

export function gqlErrorFormatter(execution: ExecutionResult): {
  statusCode: number;
  response: ExecutionResult;
} {
  const [error] = execution.errors || [];
  if (!error) return { statusCode: 200, response: execution };

  const originalError = error.originalError || error;
  const digest = createDigestFromError(originalError);

  if (originalError instanceof ZodValidationException) {
    const zodException = originalError as ZodValidationException;
    const zodError = zodException.getZodError() as unknown as ZodError;
    const issues = zodError.issues;

    return {
      statusCode: 200,
      response: {
        errors: execution.errors?.map((e) => ({
          message: 'Validation Failed',
          locations: e.locations,
          path: e.path,
          extensions: {
            code: 'BAD_USER_INPUT',
            validationErrors: issues.map((issue: core.$ZodIssue) => ({
              field: issue.path.join('.'),
              message: issue.message,
              code: issue.code,
            })),
            digest,
          },
          // biome-ignore lint/suspicious/noExplicitAny: GraphQL types are too strict
        })) as any,
        data: execution.data,
      },
    };
  }

  if (originalError instanceof HttpException) {
    const status = originalError.getStatus();
    // biome-ignore lint/suspicious/noExplicitAny: HttpException types are too strict
    const response = originalError.getResponse() as any;

    let code = 'INTERNAL_SERVER_ERROR';
    if (status === HttpStatus.BAD_REQUEST) code = 'BAD_USER_INPUT';
    if (status === HttpStatus.UNAUTHORIZED) code = 'UNAUTHENTICATED';
    if (status === HttpStatus.FORBIDDEN) code = 'FORBIDDEN';
    if (status === HttpStatus.NOT_FOUND) code = 'NOT_FOUND';

    return {
      statusCode: 200,
      response: {
        errors: execution.errors?.map((e) => ({
          message: response.message || e.message,
          locations: e.locations,
          path: e.path,
          extensions: {
            code,
            digest,
            details: typeof response === 'object' ? response : null,
          },
          // biome-ignore lint/suspicious/noExplicitAny: GraphQL types are too strict
        })) as any,
        data: execution.data,
      },
    };
  }

  if (originalError instanceof GraphQLError && !error.originalError) {
    return {
      statusCode: 400,
      response: {
        errors: execution.errors?.map((e) => ({
          message: e.message,
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
            digest,
          },
          // biome-ignore lint/suspicious/noExplicitAny: GraphQL types are too strict
        })) as any,
        data: null,
      },
    };
  }

  logger.error({
    message: 'Internal GraphQL Error',
    originalError,
    digest,
    stack: originalError instanceof Error ? originalError.stack : null,
  });

  return {
    statusCode: 200,
    response: {
      errors: execution.errors?.map((e) => ({
        message: 'Internal Server Error',
        locations: e.locations,
        path: e.path,
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          digest,
        },
        // biome-ignore lint/suspicious/noExplicitAny: GraphQL types are too strict
      })) as any,
      data: execution.data,
    },
  };
}

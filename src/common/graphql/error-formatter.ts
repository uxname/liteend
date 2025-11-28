import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ExecutionResult } from 'graphql';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

const logger = new Logger('GraphQLErrorFormatter');

export function gqlErrorFormatter(
  execution: ExecutionResult,
  context: any,
): { statusCode: number; response: ExecutionResult } {
  const errors = execution.errors;

  if (!errors || errors.length === 0) {
    return { statusCode: 200, response: execution };
  }

  const requestId = context?.req?.id || 'unknown';

  const formattedErrors = errors.map((error) => {
    const originalError = error.originalError;

    if (originalError instanceof ZodValidationException) {
      const issues = (originalError.getZodError() as ZodError).issues;
      return {
        message: 'Validation Failed',
        locations: error.locations,
        path: error.path,
        extensions: {
          code: 'BAD_USER_INPUT',
          requestId,
          details: issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
      };
    }

    if (originalError instanceof HttpException) {
      const status = originalError.getStatus();
      let code = 'INTERNAL_SERVER_ERROR';

      if (status === HttpStatus.BAD_REQUEST) code = 'BAD_USER_INPUT';
      if (status === HttpStatus.UNAUTHORIZED) code = 'UNAUTHENTICATED';
      if (status === HttpStatus.FORBIDDEN) code = 'FORBIDDEN';
      if (status === HttpStatus.NOT_FOUND) code = 'NOT_FOUND';

      const response = originalError.getResponse();
      const details = typeof response === 'object' ? response : null;

      return {
        message: originalError.message,
        locations: error.locations,
        path: error.path,
        extensions: {
          code,
          requestId,
          details,
        },
      };
    }

    logger.error({
      msg: 'GraphQL Internal Error',
      err: originalError || error,
      requestId,
    });

    return {
      message: 'Internal Server Error',
      locations: error.locations,
      path: error.path,
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        requestId,
      },
    };
  });

  return {
    statusCode: 200,
    response: {
      data: execution.data,
      errors: formattedErrors as unknown as GraphQLError[],
    },
  };
}

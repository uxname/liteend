import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (response.sent) return;

    const status = this.getHttpStatus(exception);
    const errorBody = this.buildErrorBody(exception, status, request.id);

    if (status >= 500) {
      this.logger.error({
        msg: 'HTTP Error',
        err: exception,
        requestId: request.id,
      });
    } else {
      // Для отладки 4xx ошибок можно включить warn
      this.logger.warn({
        msg: 'Client Error',
        statusCode: status,
        requestId: request.id,
        error: errorBody.message,
      });
    }

    response.status(status).send(errorBody);
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof ZodValidationException)
      return HttpStatus.BAD_REQUEST;
    if (exception instanceof HttpException) return exception.getStatus();
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildErrorBody(
    exception: unknown,
    status: number,
    requestId: string,
  ) {
    const base = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      requestId,
    };

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as unknown as ZodError;
      return {
        ...base,
        error: 'Validation Failed',
        message: 'Input validation error',
        details: zodError.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      };
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as HttpException).message
          : exception.message;

      return {
        ...base,
        error: exception.name,
        message,
      };
    }

    return {
      ...base,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    };
  }
}

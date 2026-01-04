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

const SILENT_404_EXTENSIONS = [
  '.map',
  '.ico',
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
];

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (response.sent) return;

    const status = this.getHttpStatus(exception);
    const url = request.url;
    const isNoisy404 =
      status === HttpStatus.NOT_FOUND &&
      SILENT_404_EXTENSIONS.some((ext) => url.endsWith(ext));

    const errorBody = this.buildErrorBody(exception, status, request.id);

    const user = (
      request as FastifyRequest & { user?: { id: number | string } }
    ).user;
    const userId = user?.id;

    if (!isNoisy404) {
      this.logException(
        exception,
        status,
        request.id,
        url,
        errorBody.message,
        userId,
      );
    }

    response.status(status).send(errorBody);
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof ZodValidationException)
      return HttpStatus.BAD_REQUEST;
    if (exception instanceof HttpException) return exception.getStatus();
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private logException(
    exc: unknown,
    status: number,
    requestId: string,
    url: string,
    message: string | unknown,
    userId?: number | string,
  ): void {
    const logData = {
      requestId,
      url,
      statusCode: status,
      userId,
      message,
    };

    if (status >= 500) {
      this.logger.error({
        ...logData,
        msg: 'Internal Server Error',
        err:
          exc instanceof Error
            ? { message: exc.message, stack: exc.stack }
            : exc,
      });
      return;
    }

    this.logger.warn({ ...logData, msg: 'HTTP Client Error' });
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
      const zodError = exception.getZodError() as ZodError;
      return {
        ...base,
        error: 'Validation Failed',
        message: 'Input validation error',
        details: zodError.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as HttpExceptionResponse;
      const message =
        typeof res === 'object' && res !== null
          ? res.message || exception.message
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

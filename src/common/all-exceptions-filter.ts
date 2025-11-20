import crypto from 'node:crypto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

// Constants
const DIGEST_LENGTH = 16;

// Extended interface for NotFoundException with additional properties
interface ExtendedNotFoundException extends NotFoundException {
  path?: string;
  method?: string;
}

// Detailed error response interface
interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  digest: string;
  stack?: string;
  path?: string;
  method?: string;
}

// Structured error data for digest creation
interface ErrorData {
  message: string;
  name: string;
  timestamp: string;
  locations?: unknown;
  path?: unknown;
  stack?: string;
}

/**
 * Global exception filter to handle HTTP and WebSocket exceptions
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const contextType = host.getType();

    switch (contextType) {
      case 'http': {
        this.handleHttpException(exception, host);
        break;
      }
      case 'ws': {
        this.handleWsException(exception, host);
        break;
      }
      default: {
        this.logUnhandledContextType(contextType);
      }
    }
  }

  /**
   * Handles HTTP context exceptions
   */
  private handleHttpException(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const { errorResponse, statusCode } = this.prepareErrorResponse(exception);

    this.logError(errorResponse);

    response.status(statusCode).json(errorResponse);
  }

  /**
   * Handles WebSocket context exceptions
   */
  private handleWsException(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToWs();
    const client = context.getClient();

    const { errorResponse } = this.prepareErrorResponse(exception);

    this.logError(errorResponse);

    client.emit('error', errorResponse);
  }

  /**
   * Prepares a standardized error response
   */
  private prepareErrorResponse(exception: unknown): {
    statusCode: number;
    errorResponse: ErrorResponse;
  } {
    const digest = createDigestFromError(exception);
    const statusCode = this.determineHttpStatus(exception);

    // Handle specific 404 errors
    if (exception instanceof NotFoundException) {
      const notFoundException = exception as ExtendedNotFoundException;
      return {
        statusCode: HttpStatus.NOT_FOUND,
        errorResponse: {
          message: 'Resource not found',
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
          timestamp: new Date().toISOString(),
          path: notFoundException.path ?? undefined,
          method: notFoundException.method ?? undefined,
          digest,
        },
      };
    }

    // Generic error response
    const errorResponse: ErrorResponse = {
      message: this.extractErrorMessage(exception),
      error: this.extractErrorName(exception),
      statusCode,
      timestamp: new Date().toISOString(),
      digest,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    return { statusCode, errorResponse };
  }

  /**
   * Determines HTTP status code for the exception
   */
  private determineHttpStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Extracts error message with fallback
   */
  private extractErrorMessage(error: unknown): string {
    return error instanceof Error
      ? error.message
      : 'An unexpected error occurred';
  }

  /**
   * Extracts error name with fallback
   */
  private extractErrorName(error: unknown): string {
    return error instanceof Error ? error.name : 'UnknownError';
  }

  /**
   * Logs errors with additional context
   */
  private logError(exception: unknown): void {
    this.logger.error(exception);
  }

  /**
   * Logs unhandled context types
   */
  private logUnhandledContextType(contextType: string): void {
    this.logger.warn(`Unhandled context type: ${contextType}`);
  }
}

/**
 * Generates a deterministic hash digest for error logging
 */
export function createDigestFromError(error: unknown): string {
  const currentDate = new Date().toISOString();

  // Prepare error data for digest creation
  const errorData: ErrorData = {
    message: error instanceof Error ? error.message : 'Unknown error',
    name: error instanceof Error ? error.name : 'UnknownError',
    timestamp: currentDate,
  };

  // Conditionally add additional error properties
  if (error instanceof Error) {
    if ('locations' in error) errorData.locations = error.locations;
    if ('path' in error) errorData.path = error.path;
    if ('stack' in error) errorData.stack = error.stack;
  }

  // Trim large properties (to mitigate potential DoS)
  const MAX_ERROR_SIZE = 1024; // Limit the size of error details to 1KB

  const trimmedErrorData = JSON.stringify(errorData, (_, value) =>
    value && typeof value === 'string' && value.length > MAX_ERROR_SIZE
      ? value.slice(0, MAX_ERROR_SIZE) // Truncate strings to limit size
      : value,
  );

  // Generate the digest
  return crypto
    .createHash('sha256')
    .update(trimmedErrorData)
    .digest('hex')
    .slice(0, DIGEST_LENGTH);
}

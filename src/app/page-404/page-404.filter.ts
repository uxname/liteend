import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Catch(NotFoundException)
export class Page404Filter implements ExceptionFilter {
  private readonly logger = new Logger(Page404Filter.name);

  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    // Log the error details for better debugging and monitoring
    this.logger.error(`Page not found: ${request.url}`, exception.stack);

    // Respond with a consistent error structure
    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Not found',
      error: 'Not Found',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

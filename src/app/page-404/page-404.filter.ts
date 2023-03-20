import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

@Catch(NotFoundException)
export class Page404Filter implements ExceptionFilter {
  catch(_exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    response.status(HttpStatus.NOT_FOUND).json({
      message: 'Not found',
    });
  }
}

import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AllExceptionsFilter } from '@/common/all-exceptions-filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  const createMockHost = (
    type: string,
    _status: number = 200,
    url: string = '/test',
    requestId: string = 'test-request-id',
  ) => {
    const mockResponse = {
      sent: false,
      status: vi.fn(() => mockResponse),
      send: vi.fn(),
    };

    const mockRequest = {
      url,
      id: requestId,
      user: undefined,
    };

    const mockContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: vi.fn().mockReturnValue(mockResponse),
        getRequest: vi.fn().mockReturnValue(mockRequest),
      }),
      getType: vi.fn().mockReturnValue(type),
    };

    return {
      context: mockContext as unknown as ArgumentsHost,
      response: mockResponse,
      request: mockRequest,
    };
  };

  describe('catch', () => {
    it('should not handle non-http exceptions', () => {
      const { context } = createMockHost('ws');

      filter.catch(new Error('test'), context);

      expect(context.switchToHttp).not.toHaveBeenCalled();
    });

    it('should return early if response already sent', () => {
      const { context, response } = createMockHost('http');
      response.sent = true;

      filter.catch(new Error('test'), context);

      expect(response.status).not.toHaveBeenCalled();
    });

    it('should handle HttpException', () => {
      const { context, response } = createMockHost('http');
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, context);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(response.send).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden',
          error: 'HttpException',
        }),
      );
    });

    it('should handle generic Error as INTERNAL_SERVER_ERROR', () => {
      const { context, response } = createMockHost('http');
      const exception = new Error('Internal error');

      filter.catch(exception, context);

      expect(response.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(response.send).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        }),
      );
    });

    it('should include requestId in response', () => {
      const { context, response } = createMockHost(
        'http',
        200,
        '/test',
        'unique-id-123',
      );
      const exception = new Error('test');

      filter.catch(exception, context);

      expect(response.send).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: 'unique-id-123',
        }),
      );
    });

    it('should include timestamp in response', () => {
      const { context, response } = createMockHost('http');
      const exception = new Error('test');

      filter.catch(exception, context);

      expect(response.send).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        }),
      );
    });

    it('should handle 404 for non-static files normally', () => {
      const { context, response } = createMockHost(
        'http',
        404,
        '/api/nonexistent',
      );
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

      filter.catch(exception, context);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });
  });
});

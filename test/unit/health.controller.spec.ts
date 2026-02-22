import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyReply } from 'fastify';
import Redis from 'ioredis';
import { HealthController } from '@/app/health/health.controller';
import { PrismaService } from '@/common/prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let mockRedis: { ping: ReturnType<typeof vi.fn> };
  let responseCode: number;
  let responseBody: unknown;

  const mockPrismaService = {
    $executeRaw: vi.fn(),
  };

  const mockConfigService = {
    get: vi.fn((key: string) => {
      const config: Record<string, string | number> = {
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: 'password',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    mockRedis = {
      ping: vi.fn().mockResolvedValue('PONG'),
    };

    responseCode = 0;
    responseBody = null;

    const mockSendFn = vi.fn().mockImplementation((body: unknown) => {
      responseBody = body;
      return mockResponse as FastifyReply;
    });
    const mockCodeFn = vi.fn().mockImplementation((code: number) => {
      responseCode = code;
      return mockResponse as FastifyReply;
    });

    const mockResponse: Partial<FastifyReply> = {
      code: mockCodeFn,
      send: mockSendFn,
    };

    vi.spyOn(Redis.prototype, 'ping').mockImplementation(
      mockRedis.ping as (this: Redis) => Promise<string>,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthController,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const getResponse = (): FastifyReply => {
    const mockSendFn = vi.fn().mockImplementation((body: unknown) => {
      responseBody = body;
      return mockResponse as FastifyReply;
    });
    const mockCodeFn = vi.fn().mockImplementation((code: number) => {
      responseCode = code;
      return mockResponse as FastifyReply;
    });
    const mockResponse: Partial<FastifyReply> = {
      code: mockCodeFn,
      send: mockSendFn,
    };
    return mockResponse as FastifyReply;
  };

  const getBodyValue = <T>(key: keyof T): unknown => {
    return (responseBody as T)[key];
  };

  describe('getHealth', () => {
    it('should return OK status when both database and Redis are healthy', async () => {
      mockPrismaService.$executeRaw.mockResolvedValue({});
      mockRedis.ping.mockResolvedValue('PONG');

      await controller.getHealth(getResponse());

      expect(responseCode).toBe(HttpStatus.OK);
      expect(getBodyValue<{ status: string }>('status')).toBe('ok');
      expect(
        getBodyValue<{ info: { database: { status: string } } }>('info'),
      ).toHaveProperty('database');
    });

    it('should return error status when database is down', async () => {
      mockPrismaService.$executeRaw.mockRejectedValue(
        new Error('Database connection failed'),
      );
      mockRedis.ping.mockResolvedValue('PONG');

      await controller.getHealth(getResponse());

      expect(responseCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(getBodyValue<{ status: string }>('status')).toBe('error');
      const info = getBodyValue<{ info: { database: { status: string } } }>(
        'info',
      );
      expect(info).toHaveProperty('database');
    });

    it('should return error status when Redis is down', async () => {
      mockPrismaService.$executeRaw.mockResolvedValue({});
      mockRedis.ping.mockRejectedValue(new Error('Redis connection failed'));

      await controller.getHealth(getResponse());

      expect(responseCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(getBodyValue<{ status: string }>('status')).toBe('error');
    });

    it('should return error status when both database and Redis are down', async () => {
      mockPrismaService.$executeRaw.mockRejectedValue(
        new Error('Database connection failed'),
      );
      mockRedis.ping.mockRejectedValue(new Error('Redis connection failed'));

      await controller.getHealth(getResponse());

      expect(responseCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(getBodyValue<{ status: string }>('status')).toBe('error');
    });

    it('should return error status when Redis returns non-PONG response', async () => {
      mockPrismaService.$executeRaw.mockResolvedValue({});
      mockRedis.ping.mockResolvedValue('NOT_PONG');

      await controller.getHealth(getResponse());

      expect(responseCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(getBodyValue<{ status: string }>('status')).toBe('error');
    });
  });
});

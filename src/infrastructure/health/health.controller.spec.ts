import { ServiceUnavailableException } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/common/prisma/prisma.service';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './indicators/redis.health';

describe('HealthController', () => {
  let module: TestingModule;
  let controller: HealthController;
  let dbIndicator: PrismaHealthIndicator;
  let redisIndicator: RedisHealthIndicator;
  let memoryIndicator: MemoryHealthIndicator;
  let diskIndicator: DiskHealthIndicator;

  const mockHealthCheckResult: HealthCheckResult = {
    status: 'ok',
    info: {
      database: { status: 'up' },
      redis: { status: 'up' },
      memory_heap: { status: 'up' },
      storage: { status: 'up' },
    },
    error: {},
    details: {
      database: { status: 'up' },
      redis: { status: 'up' },
      memory_heap: { status: 'up' },
      storage: { status: 'up' },
    },
  };

  beforeEach(async () => {
    const mockDbIndicator = {
      pingCheck: vi.fn().mockResolvedValue({
        database: { status: 'up' },
      }),
    };

    const mockRedisIndicator = {
      isHealthy: vi.fn().mockResolvedValue({
        redis: { status: 'up' },
      }),
    };

    const mockMemoryIndicator = {
      checkHeap: vi.fn().mockResolvedValue({
        memory_heap: { status: 'up' },
      }),
    };

    const mockDiskIndicator = {
      checkStorage: vi.fn().mockResolvedValue({
        storage: { status: 'up' },
      }),
    };

    const mockHealthCheckService = {
      check: vi.fn().mockImplementation(async (indicators) => {
        // Call all indicator functions and aggregate results
        for (const indicator of indicators) {
          await indicator();
        }
        return mockHealthCheckResult;
      }),
    };

    const mockPrismaService = {
      $executeRaw: vi.fn(),
    };

    module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: PrismaHealthIndicator, useValue: mockDbIndicator },
        { provide: RedisHealthIndicator, useValue: mockRedisIndicator },
        { provide: MemoryHealthIndicator, useValue: mockMemoryIndicator },
        { provide: DiskHealthIndicator, useValue: mockDiskIndicator },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    dbIndicator = module.get<PrismaHealthIndicator>(PrismaHealthIndicator);
    redisIndicator = module.get<RedisHealthIndicator>(RedisHealthIndicator);
    memoryIndicator = module.get<MemoryHealthIndicator>(MemoryHealthIndicator);
    diskIndicator = module.get<DiskHealthIndicator>(DiskHealthIndicator);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('check', () => {
    it('should return health check result when all systems are healthy', async () => {
      const result = await controller.check();

      expect(result).toEqual(mockHealthCheckResult);
      expect(result.status).toBe('ok');
    });

    it('should include database indicator', async () => {
      await controller.check();

      expect(dbIndicator.pingCheck).toHaveBeenCalledWith(
        'database',
        expect.any(Object),
      );
    });

    it('should include redis indicator', async () => {
      await controller.check();

      expect(redisIndicator.isHealthy).toHaveBeenCalled();
    });

    it('should include memory indicator', async () => {
      await controller.check();

      expect(memoryIndicator.checkHeap).toHaveBeenCalledWith(
        'memory_heap',
        150 * 1024 * 1024,
      );
    });

    it('should include disk indicator', async () => {
      await controller.check();

      expect(diskIndicator.checkStorage).toHaveBeenCalledWith('storage', {
        path: '/',
        thresholdPercent: 0.9,
      });
    });

    it('should call check with 4 indicator functions', async () => {
      await controller.check();

      expect(dbIndicator.pingCheck).toHaveBeenCalled();
      expect(redisIndicator.isHealthy).toHaveBeenCalled();
      expect(memoryIndicator.checkHeap).toHaveBeenCalled();
      expect(diskIndicator.checkStorage).toHaveBeenCalled();
    });

    it('should throw ServiceUnavailableException when redis is unhealthy', async () => {
      const healthCheckService =
        module.get<HealthCheckService>(HealthCheckService);
      vi.mocked(healthCheckService.check).mockRejectedValue(
        new ServiceUnavailableException({
          status: 'error',
          info: {},
          error: { redis: { status: 'down' } },
          details: { redis: { status: 'down' } },
        }),
      );

      await expect(controller.check()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it('should throw ServiceUnavailableException when database is unhealthy', async () => {
      const healthCheckService =
        module.get<HealthCheckService>(HealthCheckService);
      vi.mocked(healthCheckService.check).mockRejectedValue(
        new ServiceUnavailableException({
          status: 'error',
          info: {},
          error: { database: { status: 'down' } },
          details: { database: { status: 'down' } },
        }),
      );

      await expect(controller.check()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});

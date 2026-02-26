import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import type Redis from 'ioredis';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';

@Controller('health')
export class HealthController {
  private readonly logger: Logger = new Logger(HealthController.name);
  private readonly client: Redis;

  constructor(
    private readonly prisma: PrismaService,
    redisService: RedisService,
  ) {
    this.client = redisService.getClient();
  }

  @Get()
  async getHealth(@Res() response: FastifyReply): Promise<void> {
    const [databaseOnline, redisOnline] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const status =
      databaseOnline && redisOnline
        ? HttpStatus.OK
        : HttpStatus.SERVICE_UNAVAILABLE;

    response.code(status).send({
      status: status === HttpStatus.OK ? 'ok' : 'error',
      info: {
        serverTime: new Date().toISOString(),
        database: { status: databaseOnline ? 'ok' : 'error' },
        redis: { status: redisOnline ? 'ok' : 'error' },
      },
    });
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$executeRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database is offline', error);
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      const pong = await this.client.ping();
      if (pong !== 'PONG') {
        this.logger.error('Redis is offline');
        return false;
      }
      return true;
    } catch (error) {
      this.logger.error('Error pinging Redis', error);
      return false;
    }
  }
}

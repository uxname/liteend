import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import Redis from 'ioredis';

import { Logger } from '@/common/logger/logger';
import { PrismaService } from '@/common/prisma/prisma.service';

@Controller('health')
export class HealthController {
  private readonly logger: Logger = new Logger(HealthController.name);
  private readonly client: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
    const redisUrl = `redis://${redisHost}:${redisPort}?password=${redisPassword}`;
    this.client = new Redis(redisUrl);
  }

  @Get()
  async getHealth(@Res() response: express.Response): Promise<unknown> {
    const databaseOnline = await this.checkDatabase();
    const redisOnline = await this.checkRedis();

    const status =
      databaseOnline && redisOnline
        ? HttpStatus.OK
        : HttpStatus.SERVICE_UNAVAILABLE;
    return response.status(status).json({
      status: status === HttpStatus.OK ? 'ok' : 'error',
      info: {
        serverTime: new Date().toISOString(),
        database: { status: databaseOnline ? 'ok' : 'error' },
        redis: { status: redisOnline ? 'ok' : 'error' },
      },
    });
  }

  async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$executeRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database is offline', error);
      return false;
    }
  }

  async checkRedis(): Promise<boolean> {
    const pong = await this.client.ping();
    if (pong !== 'PONG') {
      this.logger.error('Redis is offline');
      return false;
    }
    return true;
  }
}

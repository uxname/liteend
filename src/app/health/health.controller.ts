import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import express from 'express';

import { Logger } from '@/common/logger/logger';
import { PrismaService } from '@/common/prisma/prisma.service';

@Controller('health')
export class HealthController {
  private readonly logger: Logger = new Logger(HealthController.name);
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth(@Res() response: express.Response): Promise<unknown> {
    try {
      await this.prisma.$executeRaw`SELECT 1`;
      return response.status(HttpStatus.OK).json({
        status: 'ok',
        info: {
          serverTime: new Date().toISOString(),
          database: {
            status: 'ok',
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        info: {
          serverTime: new Date().toISOString(),
          error: error.message,
        },
      });
    }
  }
}

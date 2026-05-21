import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/@generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const DATABASE_HOST = configService.getOrThrow<string>('DATABASE_HOST');
    const DATABASE_PORT = configService.getOrThrow<string>('DATABASE_PORT');
    const DATABASE_USER = configService.getOrThrow<string>('DATABASE_USER');
    const DATABASE_PASSWORD =
      configService.getOrThrow<string>('DATABASE_PASSWORD');
    const DATABASE_NAME = configService.getOrThrow<string>('DATABASE_NAME');

    const DATABASE_URL = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public`;

    const pool = new Pool({
      connectionString: DATABASE_URL,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 10,
    });
    // TODO(#1): remove cast when @prisma/adapter-pg updates bundled @types/pg
    const adapter = new PrismaPg(
      pool as unknown as ConstructorParameters<typeof PrismaPg>[0],
    );

    super({ adapter });
  }

  async onModuleInit() {
    const maxRetries = 5;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        const delay = Math.min(attempt * 1000, 5000);
        this.logger.warn({
          msg: `DB connection attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms`,
          err: error instanceof Error ? error.message : error,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

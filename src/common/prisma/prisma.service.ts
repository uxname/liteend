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
import {
  DB_CONNECT_TIMEOUT,
  DB_IDLE_TIMEOUT,
  DB_MAX_RETRIES,
  DB_POOL_MAX,
  DB_RETRY_BASE_DELAY,
  DB_RETRY_MAX_DELAY,
} from '@/common/constants';

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
      connectionTimeoutMillis: DB_CONNECT_TIMEOUT,
      idleTimeoutMillis: DB_IDLE_TIMEOUT,
      max: DB_POOL_MAX,
    });
    // TODO(#1): remove cast when @prisma/adapter-pg updates bundled @types/pg
    const adapter = new PrismaPg(
      pool as unknown as ConstructorParameters<typeof PrismaPg>[0],
    );

    super({ adapter });
  }

  async onModuleInit() {
    for (let attempt = 1; attempt <= DB_MAX_RETRIES; attempt++) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        if (attempt === DB_MAX_RETRIES) throw error;
        const delay =
          Math.min(attempt * DB_RETRY_BASE_DELAY, DB_RETRY_MAX_DELAY) *
          (0.5 + Math.random() * 0.5);
        this.logger.warn({
          msg: `DB connection attempt ${attempt}/${DB_MAX_RETRIES} failed, retrying in ${Math.round(delay)}ms`,
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

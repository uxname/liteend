import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
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
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

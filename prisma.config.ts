import '@dotenvx/dotenvx/config';
import { defineConfig, env } from 'prisma/config';

const DATABASE_HOST = env('DATABASE_HOST');
const DATABASE_PORT = env('DATABASE_PORT');
const DATABASE_USER = env('DATABASE_USER');
const DATABASE_PASSWORD = env('DATABASE_PASSWORD');
const DATABASE_NAME = env('DATABASE_NAME');

const DATABASE_URL = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: DATABASE_URL,
  },
});

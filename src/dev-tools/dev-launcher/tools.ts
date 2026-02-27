export type DevToolCategory = 'database' | 'queue' | 'api' | 'infra' | 'other';

export interface DevTool {
  name: string;
  description: string;
  href: string;
  category: DevToolCategory;
  badge?: string;
  icon?: string;
  path?: string;
  wide?: boolean;
}

export const tools: DevTool[] = [
  {
    name: 'Prisma Studio',
    description:
      'Inspect and seed Postgres schemas via /studio (use PRISMA_STUDIO_LOGIN/PASSWORD).',
    href: '/studio',
    category: 'database',
    badge: 'db admin',
    icon: '🧱',
    path: '/studio',
    wide: true,
  },
  {
    name: 'Bull Board',
    description:
      'Monitor background queues and retry jobs at /board (BULL_BOARD_* credentials).',
    href: '/board',
    category: 'queue',
    badge: 'queues',
    icon: '🟢',
    path: '/board',
    wide: true,
  },
  {
    name: 'pgAdmin',
    description:
      'Dedicated pgAdmin panel on http://localhost:5100 (set DB_ADMIN credentials).',
    href: 'http://localhost:5100',
    category: 'database',
    icon: '🗄️',
    path: 'http://localhost:5100',
  },
  {
    name: 'Redis Commander',
    description:
      'Browse Redis keys and streams via http://localhost:5200 (REDIS_ADMIN credentials).',
    href: 'http://localhost:5200',
    category: 'infra',
    icon: '🧠',
    path: 'http://localhost:5200',
  },
  {
    name: 'GraphQL Playground',
    description: 'Execute GraphQL queries and inspect schema at /altair.',
    href: '/altair',
    category: 'api',
    icon: '🛰️',
    path: '/altair',
  },
  {
    name: 'Swagger UI',
    description: 'Explore REST contracts and send requests from /swagger.',
    href: '/swagger',
    category: 'api',
    badge: 'docs',
    icon: '🧭',
    path: '/swagger',
  },
  {
    name: 'Health Check',
    description:
      'Service liveness/readiness probe endpoint at /health (used for monitoring and orchestration).',
    href: '/health',
    category: 'api',
    badge: 'monitoring',
    icon: '❤️',
    path: '/health',
  },
  {
    name: 'Logs Admin',
    description:
      'View and filter application logs via /logs (supports search and level filtering).',
    href: '/logs',
    category: 'infra',
    badge: 'observability',
    icon: '📜',
    path: '/logs',
    wide: true,
  },
];

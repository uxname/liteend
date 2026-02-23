import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import * as process from 'node:process';
import { Params } from 'nestjs-pino';
import { TransportTargetOptions } from 'pino';
import packageJson from '../../../package.json';

const LOG_DIR = path.join(process.cwd(), 'data', 'logs');
const IS_DEV =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
const IS_TEST = process.env.NODE_ENV === 'test';

const LOG_ROTATION_SIZE = '20m';
const LOG_RETENTION_COUNT = 10;

const IGNORED_PATH_SEGMENTS = [
  '/health',
  '/altair',
  '/favicon.ico',
  '/logs',
  '/swagger',
  '/.well-known',
];

const IGNORED_BODY_PATHS = ['/upload', '/uploads/', '/health', '/.well-known'];

function shouldCaptureBody(url: string): boolean {
  return !IGNORED_BODY_PATHS.some((path) => url.startsWith(path));
}

const createFileTransport = (
  filename: string,
  level: string,
): TransportTargetOptions => ({
  target: 'pino-roll',
  level,
  options: {
    file: path.join(LOG_DIR, filename),
    frequency: 'daily',
    mkdir: true,
    size: LOG_ROTATION_SIZE,
    limit: {
      count: LOG_RETENTION_COUNT,
    },
  },
});

interface PinoCustomProps {
  user?: { id: number | string; roles?: string[] };
  graphql?: {
    type: string;
    operation: string;
    responseTime?: number;
    response?: unknown;
    args?: unknown;
  };
  raw?: {
    user?: { id: number | string; roles?: string[] };
    graphql?: {
      type: string;
      operation: string;
      responseTime?: number;
      response?: unknown;
      args?: unknown;
    };
  };
}

export const pinoConfig: Params = {
  pinoHttp: {
    level: IS_TEST ? 'silent' : IS_DEV ? 'trace' : 'info',

    mixin: () => ({
      app: { name: packageJson.name, version: packageJson.version },
    }),

    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        body: shouldCaptureBody(req.url) && req.body ? req.body : undefined,
        query: req.query,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: {
          'content-type': res.getHeader('content-type'),
          'content-length': res.getHeader('content-length'),
        },
      }),
    },

    customProps: (req: IncomingMessage) => {
      const customReq = req as unknown as PinoCustomProps;
      const user = customReq.user || customReq.raw?.user;
      const graphql = customReq.graphql || customReq.raw?.graphql;
      const roles = user?.roles;
      return {
        userId: user?.id,
        userRole: roles && roles.length > 0 ? roles.join(',') : null,
        graphql,
        responseTime: graphql?.responseTime,
      };
    },

    customLogLevel: (
      req: IncomingMessage,
      res: ServerResponse,
      err?: Error,
    ) => {
      const url = req.url || '';
      const isIgnored =
        IGNORED_PATH_SEGMENTS.some((s) => url.includes(s)) ||
        url.endsWith('.map');

      if (isIgnored || res.statusCode === 304) return 'silent';
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    customSuccessMessage: (
      req: IncomingMessage,
      _res: ServerResponse,
      responseTime: number,
    ) => {
      const customReq = req as unknown as PinoCustomProps;
      const gql = customReq.graphql || customReq.raw?.graphql;
      if (gql) {
        return `GraphQL ${gql.type} ${gql.operation} completed in ${Math.round(responseTime)}ms`;
      }
      return `${req.method} ${req.url} completed in ${Math.round(responseTime)}ms`;
    },

    autoLogging: true,

    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers["x-api-key"]',
        'req.body.password',
        'req.body.token',
        'req.body.accessToken',
        'req.body.refreshToken',
        'req.body.variables.password',
        'req.body.variables.token',
        'req.body.variables.accessToken',
        'req.body.variables.refreshToken',
        'res.headers["set-cookie"]',
        '*.password',
        '*.accessToken',
        '*.refreshToken',
        '*.secret',
        '*.apiKey',
        '*.authorization',
      ],
      remove: true,
    },

    transport: {
      targets: [
        ...(IS_DEV
          ? [
              {
                target: 'pino-pretty',
                level: 'trace',
                options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss.l',
                  ignore: 'pid,hostname,app',
                  singleLine: false,
                  messageFormat: (log: Record<string, unknown>) => {
                    const gql = log.graphql as
                      | { type: string; operation: string }
                      | undefined;
                    const req = log.req as
                      | { method: string; url: string }
                      | undefined;
                    const user = log.userId
                      ? `User(${log.userId})${log.userRole ? ` [${log.userRole}]` : ''}`
                      : 'Guest';
                    const timing = log.responseTime
                      ? ` ⚡ ${log.responseTime}ms`
                      : '';
                    if (gql) {
                      return `👤 ${user} | GQL ${gql.type} '${gql.operation}'${timing}`;
                    }
                    const method = req?.method || '';
                    const url = req?.url || '';
                    return `👤 ${user} | ${method} ${url}${timing}`;
                  },
                  levelPrettifier: (level: number) => {
                    const colors: Record<number, string> = {
                      10: '\x1b[90m',
                      20: '\x1b[36m',
                      30: '\x1b[32m',
                      40: '\x1b[33m',
                      50: '\x1b[31m',
                      60: '\x1b[35m',
                    };
                    const labels: Record<number, string> = {
                      10: 'TRACE',
                      20: 'DEBUG',
                      30: 'INFO',
                      40: 'WARN',
                      50: 'ERROR',
                      60: 'FATAL',
                    };
                    return `\x1b[1m${colors[level] || ''}${labels[level] || level}\x1b[0m`;
                  },
                },
              },
            ]
          : /* Production: no stdout transport = default JSON output */ []),
        createFileTransport('all/log', 'trace'),
        createFileTransport('error/log', 'error'),
      ],
    },
  },
};

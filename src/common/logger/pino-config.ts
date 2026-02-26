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
      res: (res) => {
        const getHeader = (key: string) => {
          if (typeof res.getHeader === 'function') return res.getHeader(key);
          if (res.headers && typeof res.headers === 'object')
            return res.headers[key];
          return undefined;
        };
        return {
          statusCode: res.statusCode,
          headers: {
            'content-type': getHeader('content-type'),
            'content-length': getHeader('content-length'),
          },
        };
      },
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
      const user = customReq.user || customReq.raw?.user;

      const userId = user?.id;
      const userRole = user?.roles?.join(',');
      const userDisplay = userId
        ? `User(${userId})${userRole ? ` [${userRole}]` : ''}`
        : 'Guest';

      const timing = ` ⚡ ${Math.round(responseTime)}ms`;

      if (gql) {
        return `👤 ${userDisplay} | GQL ${gql.type} '${gql.operation}'${timing}`;
      }
      return `👤 ${userDisplay} | ${req.method} ${req.url}${timing}`;
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
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname,app,userId,userRole,responseTime',
                  singleLine: true,
                },
              },
            ]
          : /*! Production: no stdout transport = default JSON output */ []),
        createFileTransport('all/log', 'trace'),
        createFileTransport('error/log', 'error'),
      ],
    },
  },
};

import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import * as process from 'node:process';
import { Params } from 'nestjs-pino';
import { TransportTargetOptions } from 'pino';
import packageJson from '../../../package.json';

const LOG_DIR = path.join(process.cwd(), 'data', 'logs');
const IS_DEV = process.env.NODE_ENV !== 'production';

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

export const pinoConfig: Params = {
  pinoHttp: {
    level: IS_DEV ? 'trace' : 'info',

    mixin: () => ({
      app: { name: packageJson.name, version: packageJson.version },
    }),

    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },

    customProps: (req: any) => {
      const user = req.user || req.raw?.user;
      const graphql = req.graphql || req.raw?.graphql;
      return {
        userId: user?.id,
        graphql,
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
      req: any,
      _res: ServerResponse,
      responseTime: number,
    ) => {
      const gql = req.graphql || req.raw?.graphql;
      if (gql) {
        return `GraphQL ${gql.type} ${gql.operation} completed in ${Math.round(responseTime)}ms`;
      }
      return `${req.method} ${req.url} completed in ${Math.round(responseTime)}ms`;
    },

    autoLogging: true,

    redact: {
      paths: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.token',
        'req.body.variables.password',
        'res.headers["set-cookie"]',
      ],
      remove: true,
    },

    transport: {
      targets: [
        IS_DEV
          ? {
              target: 'pino-pretty',
              level: 'trace',
              options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname,app',
                singleLine: true,
              },
            }
          : {
              target: 'pino/file',
              level: 'info',
              options: { destination: 1 },
            },
        createFileTransport('all/log', 'trace'),
        createFileTransport('error/log', 'error'),
      ],
    },
  },
};

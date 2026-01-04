import { IncomingMessage } from 'node:http';
import path from 'node:path';
import * as process from 'node:process';
import { Params } from 'nestjs-pino';
import { TransportTargetOptions } from 'pino';

const LOG_DIR = path.join(process.cwd(), 'data', 'logs');
const IS_DEV = process.env.NODE_ENV !== 'production';

const LOG_ROTATION_SIZE = '20m';
const LOG_RETENTION_COUNT = 10;

const IGNORED_PATH_SEGMENTS = ['/health', '/altair', '/favicon.ico', '/logs'];

interface RequestWithUrl extends IncomingMessage {
  originalUrl?: string;
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

const shouldIgnoreRequest = (req: IncomingMessage): boolean => {
  const url = (req as RequestWithUrl).originalUrl || req.url || '';
  const isIgnoredPath = IGNORED_PATH_SEGMENTS.some((segment) =>
    url.includes(segment),
  );
  const isStaticMap = url.endsWith('.map');

  return isIgnoredPath || isStaticMap;
};

export const pinoConfig: Params = {
  pinoHttp: {
    level: IS_DEV ? 'trace' : 'info',
    customSuccessMessage: (_req, _res, responseTime) => {
      return `Request completed in ${Math.round(responseTime)}ms`;
    },
    autoLogging: {
      ignore: shouldIgnoreRequest,
    },
    redact: {
      paths: ['req.headers.authorization', 'req.body.password'],
      remove: true,
    },
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          level: 'trace',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
        createFileTransport('all/log', 'trace'),
        createFileTransport('error/log', 'error'),
      ],
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        ip: req.remoteAddress || req.socket?.remoteAddress,
      }),
    },
  },
};

import path from 'node:path';
import * as process from 'node:process';
import { Params } from 'nestjs-pino';
import { TransportTargetOptions } from 'pino';

const LOG_DIR = path.join(process.cwd(), 'data', 'logs');
const IS_DEV = process.env.NODE_ENV !== 'production';

const fileTransport = (filename: string): TransportTargetOptions => ({
  target: 'pino-roll',
  options: {
    file: path.join(LOG_DIR, filename),
    frequency: 'daily',
    mkdir: true,
    size: '20m',
    limit: {
      count: 10,
    },
  },
});

export const pinoConfig: Params = {
  pinoHttp: {
    level: IS_DEV ? 'trace' : 'info',
    autoLogging: {
      ignore: (req) => {
        if (req.url?.includes('/health')) return true;
        if (req.url?.includes('/favicon.ico')) return true;
        if (req.url?.startsWith('/logs')) return true;

        return false;
      },
    },
    redact: {
      paths: ['req.headers.authorization', 'req.body.password'],
      remove: true,
    },
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
          level: 'trace',
        },
        {
          ...fileTransport('all/log'),
          level: 'trace',
        },
        {
          ...fileTransport('error/log'),
          level: 'error',
        },
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

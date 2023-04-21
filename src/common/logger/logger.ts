// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any,unicorn/prefer-module */
// import cluster from 'node:cluster';
// import path from 'node:path';

import * as path from 'node:path';
import * as process from 'node:process';

import { LoggerService } from '@nestjs/common';
import log4js, { Logger as Log4jsLogger } from 'log4js';
// eslint-disable-next-line no-magic-numbers
const MAX_BACKUP_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_BACKUP_COUNT = 100; // maximum number of log files.

function getLogger(tag: string): Log4jsLogger {
  return log4js.getLogger(tag);
}

function safeCycles() {
  const seen: Array<unknown> = [];
  return (key: unknown, value: unknown) => {
    if (!value || typeof value !== 'object') {
      return value;
    }
    if (seen.includes(value)) {
      return '[Circular]';
    }
    seen.push(value);
    return value;
  };
}

export class Logger implements LoggerService {
  private readonly logger: Log4jsLogger;

  constructor(tag: string) {
    this.logger = getLogger(tag);

    const logDirectory = path.join(process.cwd(), 'data', 'logs');
    const logFileAll = path.join(logDirectory, 'all', 'all.log');
    const logFileDebug = path.join(logDirectory, 'debug', 'debug.log');
    const logFileError = path.join(logDirectory, 'error', 'error.log');
    const logFileLog = path.join(logDirectory, 'log', 'log.log');
    const logFileVerbose = path.join(logDirectory, 'verbose', 'verbose.log');
    const logFileWarn = path.join(logDirectory, 'warn', 'warn.log');

    log4js.addLayout('json', () => {
      return (logEvent) => {
        return JSON.stringify(logEvent, safeCycles());
      };
    });

    const FILE_APPENDER_LAYOUT_TYPE = 'basic'; // or 'json'

    log4js.configure({
      appenders: {
        out: {
          type: 'stdout',
          layout: {
            type: 'pattern',
            pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}] [%p] [%c] -%] %m',
          },
        },
        fileOutAll: {
          layout: { type: FILE_APPENDER_LAYOUT_TYPE },
          type: 'file',
          filename: logFileAll,
          maxLogSize: MAX_BACKUP_SIZE_BYTES,
          backups: MAX_BACKUP_COUNT,
          compress: true,
        },
        fileOutAllFilter: {
          type: 'logLevelFilter',
          level: 'trace',
          appender: 'fileOutAll',
        },
        fileOutTrace: {
          layout: { type: FILE_APPENDER_LAYOUT_TYPE },
          type: 'file',
          filename: logFileVerbose,
          maxLogSize: MAX_BACKUP_SIZE_BYTES,
          backups: MAX_BACKUP_COUNT,
          compress: true,
        },
        fileOutTraceFilter: {
          type: 'logLevelFilter',
          level: 'trace',
          maxLevel: 'trace',
          appender: 'fileOutTrace',
        },
        fileOutDebug: {
          layout: { type: FILE_APPENDER_LAYOUT_TYPE },
          type: 'file',
          filename: logFileDebug,
          maxLogSize: MAX_BACKUP_SIZE_BYTES,
          backups: MAX_BACKUP_COUNT,
          compress: true,
        },
        fileOutDebugFilter: {
          type: 'logLevelFilter',
          level: 'debug',
          maxLevel: 'debug',
          appender: 'fileOutDebug',
        },
        fileOutInfo: {
          layout: { type: FILE_APPENDER_LAYOUT_TYPE },
          type: 'file',
          filename: logFileLog,
          maxLogSize: MAX_BACKUP_SIZE_BYTES,
          backups: MAX_BACKUP_COUNT,
          compress: true,
        },
        fileOutInfoFilter: {
          type: 'logLevelFilter',
          level: 'info',
          maxLevel: 'info',
          appender: 'fileOutInfo',
        },
        fileOutWarn: {
          layout: { type: FILE_APPENDER_LAYOUT_TYPE },
          type: 'file',
          filename: logFileWarn,
          maxLogSize: MAX_BACKUP_SIZE_BYTES,
          backups: MAX_BACKUP_COUNT,
          compress: true,
        },
        fileOutWarnFilter: {
          type: 'logLevelFilter',
          level: 'warn',
          maxLevel: 'warn',
          appender: 'fileOutWarn',
        },
        fileOutError: {
          layout: { type: FILE_APPENDER_LAYOUT_TYPE },
          type: 'file',
          filename: logFileError,
          maxLogSize: MAX_BACKUP_SIZE_BYTES,
          backups: MAX_BACKUP_COUNT,
          compress: true,
        },
        fileOutErrorFilter: {
          type: 'logLevelFilter',
          level: 'error',
          maxLevel: 'error',
          appender: 'fileOutError',
        },
        fileOutFatal: {
          layout: { type: FILE_APPENDER_LAYOUT_TYPE },
          type: 'file',
          filename: logFileError,
          maxLogSize: MAX_BACKUP_SIZE_BYTES,
          backups: MAX_BACKUP_COUNT,
          compress: true,
        },
        fileOutFatalFilter: {
          type: 'logLevelFilter',
          level: 'fatal',
          maxLevel: 'fatal',
          appender: 'fileOutFatal',
        },
      },
      categories: {
        default: {
          appenders: [
            'out',
            'fileOutAllFilter',
            'fileOutTraceFilter',
            'fileOutDebugFilter',
            'fileOutInfoFilter',
            'fileOutWarnFilter',
            'fileOutErrorFilter',
            'fileOutFatalFilter',
          ],
          level: 'trace',
        },
      },
    });

    // Add warning on using default console object
    function addWarnings() {
      const log = getLogger('console');

      for (const method of ['trace', 'debug', 'log', 'info', 'warn', 'error']) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line security/detect-object-injection
        console[method] = (...arguments_: unknown[]) => {
          log.warn(
            `Console deprecated, use Logger. [${method}]:`,
            ...arguments_,
          );
        };
      }
    }

    addWarnings();
  }

  debug(message: any, ...optionalParameters: any[]): any {
    this.logger.debug(message, ...optionalParameters);
  }

  error(message: any, ...optionalParameters: any[]): any {
    this.logger.error(message, ...optionalParameters);
  }

  log(message: any, ...optionalParameters: any[]): any {
    this.logger.info(message, ...optionalParameters);
  }

  verbose(message: any, ...optionalParameters: any[]): any {
    this.logger.trace(message, ...optionalParameters);
  }

  warn(message: any, ...optionalParameters: any[]): any {
    this.logger.warn(message, ...optionalParameters);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any,unicorn/prefer-module */

import path from 'node:path';
import * as process from 'node:process';

import { LoggerService } from '@nestjs/common';
import log4js, { Logger as Log4jsLogger } from 'log4js';

const MAX_BACKUP_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_BACKUP_COUNT = 100; // Maximum number of log files.

function getLogger(tag: string): Log4jsLogger {
  return log4js.getLogger(tag);
}

// Function to handle circular references in JSON
// biome-ignore lint/suspicious/noExplicitAny: can log anything
function safeCycles(): (this: any, key: string, value: any) => any {
  const seen: Array<unknown> = [];
  // biome-ignore lint/suspicious/noExplicitAny: can log anything
  return (_key: unknown, value: unknown): any => {
    if (!value || typeof value !== 'object') return value;
    if (seen.includes(value)) return '[Circular]';
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
      return (logEvent): unknown => JSON.stringify(logEvent, safeCycles());
    });

    // Can also be 'json'
    // Before use json layout install "log4js-json-layout" package: npm i log4js-json-layout
    const FILE_APPENDER_LAYOUT_TYPE = 'basic';

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

    // Add warnings for deprecated console methods
    function addWarnings(): void {
      const log = getLogger('console');

      for (const method of ['trace', 'debug', 'log', 'info', 'warn', 'error']) {
        // @ts-expect-error
        console[method] = (...arguments_: unknown[]): void => {
          log.warn(
            `Console deprecated, use Logger. [${method}]:`,
            ...arguments_,
          );
        };
      }
    }

    addWarnings();
  }

  // biome-ignore lint/suspicious/noExplicitAny: can log anything
  debug(message: any, ...optionalParameters: any[]): void {
    this.logger.debug(message, ...optionalParameters);
  }

  // biome-ignore lint/suspicious/noExplicitAny: can log anything
  error(message: any, ...optionalParameters: any[]): void {
    this.logger.error(message, ...optionalParameters);
  }

  // biome-ignore lint/suspicious/noExplicitAny: can log anything
  log(message: any, ...optionalParameters: any[]): void {
    this.logger.info(message, ...optionalParameters);
  }

  // biome-ignore lint/suspicious/noExplicitAny: can log anything
  verbose(message: any, ...optionalParameters: any[]): void {
    this.logger.trace(message, ...optionalParameters);
  }

  // biome-ignore lint/suspicious/noExplicitAny: can log anything
  warn(message: any, ...optionalParameters: any[]): void {
    this.logger.warn(message, ...optionalParameters);
  }
}

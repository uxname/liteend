import log4js, {Logger} from 'log4js';
import cluster from 'cluster';
import path from 'path';

// eslint-disable-next-line no-magic-numbers
const MAX_BACKUP_SIZE = 5 * 1024 * 1024; // maximum size (in bytes) for the log file.
const MAX_BACKUP_COUNT = 100; // maximum number of log files.

log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        fileOutAll: {
            type: 'file',
            filename: path.join(__dirname, '/../../../data/logs/all/logs_all.log'),
            maxLogSize: MAX_BACKUP_SIZE,
            backups: MAX_BACKUP_COUNT,
            compress: true
        },
        fileOutAllFilter: {
            type: 'logLevelFilter',
            level: 'trace',
            appender: 'fileOutAll'
        },
        fileOutTrace: {
            type: 'file',
            filename: path.join(__dirname, '/../../../data/logs/trace/logs_trace.log'),
            maxLogSize: MAX_BACKUP_SIZE,
            backups: MAX_BACKUP_COUNT,
            compress: true
        },
        fileOutTraceFilter: {
            type: 'logLevelFilter',
            level: 'trace',
            maxLevel: 'trace',
            appender: 'fileOutTrace'
        },
        fileOutDebug: {
            type: 'file',
            filename: path.join(__dirname, '/../../../data/logs/debug/logs_debug.log'),
            maxLogSize: MAX_BACKUP_SIZE,
            backups: MAX_BACKUP_COUNT,
            compress: true
        },
        fileOutDebugFilter: {
            type: 'logLevelFilter',
            level: 'debug',
            maxLevel: 'debug',
            appender: 'fileOutDebug'
        },
        fileOutInfo: {
            type: 'file',
            filename: path.join(__dirname, '/../../../data/logs/info/logs_info.log'),
            maxLogSize: MAX_BACKUP_SIZE,
            backups: MAX_BACKUP_COUNT,
            compress: true
        },
        fileOutInfoFilter: {
            type: 'logLevelFilter',
            level: 'info',
            maxLevel: 'info',
            appender: 'fileOutInfo'
        },
        fileOutWarn: {
            type: 'file',
            filename: path.join(__dirname, '/../../../data/logs/warn/logs_warn.log'),
            maxLogSize: MAX_BACKUP_SIZE,
            backups: MAX_BACKUP_COUNT,
            compress: true
        },
        fileOutWarnFilter: {
            type: 'logLevelFilter',
            level: 'warn',
            maxLevel: 'warn',
            appender: 'fileOutWarn'
        },
        fileOutError: {
            type: 'file',
            filename: path.join(__dirname, '/../../../data/logs/error/logs_error.log'),
            maxLogSize: MAX_BACKUP_SIZE,
            backups: MAX_BACKUP_COUNT,
            compress: true
        },
        fileOutErrorFilter: {
            type: 'logLevelFilter',
            level: 'error',
            maxLevel: 'error',
            appender: 'fileOutError'
        },
        fileOutFatal: {
            type: 'file',
            filename: path.join(__dirname, '/../../../data/logs/fatal/logs_fatal.log'),
            maxLogSize: MAX_BACKUP_SIZE,
            backups: MAX_BACKUP_COUNT,
            compress: true
        },
        fileOutFatalFilter: {
            type: 'logLevelFilter',
            level: 'fatal',
            maxLevel: 'fatal',
            appender: 'fileOutFatal'
        }
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
                'fileOutFatalFilter'
            ],
            level: 'trace'
        }
    }
});

/**
 * Add warning on using default console object
 */
function addWarnings() {
    const log = log4js.getLogger('[console]');

    ['trace', 'debug', 'log', 'info', 'warn', 'error'].forEach(method => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line security/detect-object-injection
        console[method] = (...args: unknown[]) => {
            log.warn(`Console deprecated, use Logger. [${method}]:`, ...args);
        };
    });
}

addWarnings();

/**
 * Returns log4js object.
 * @example
 * const logger = require('./logger').getLogger('cheese');
 * logger.trace('Entering cheese testing');
 * logger.debug('Got cheese.');
 * logger.info('Cheese is Comté.');
 * logger.warn('Cheese is quite smelly.');
 * logger.error('Cheese is too ripe!');
 * logger.fatal('Cheese was breeding ground for listeria.');
 *
 * @return Logger
 */
export function getLogger(name: string): Logger {
    if (!name) {
        throw Error('Logger name is required');
    }
    const clusterId = cluster.isPrimary ? 'master' : `worker ${cluster?.worker?.id}`;
    return log4js.getLogger(`[${name}] [${clusterId}]`);
}

export * as log4js from 'log4js';

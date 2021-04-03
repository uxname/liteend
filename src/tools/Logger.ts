import log4js from 'log4js';
import config from '../config/config';
import cluster from 'cluster';

log4js.configure(config.server.loggerConfig);

/**
 * Add warning on using default console object
 */
function addWarnings() {
    const log = log4js.getLogger('[console]');

    ['trace', 'debug', 'log', 'info', 'warn', 'error'].forEach(method => {
        console[method] = (...args) => {
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
export function getLogger(name) {
    if (!name) {
        throw Error('Logger name is required');
    }
    const clusterId = cluster.isMaster ? 'master' : `worker ${cluster.worker.id}`;
    return log4js.getLogger(`[${name}] [${clusterId}]`);
}

export * as log4js from 'log4js';

module.exports = {
    logger_config: {
        appenders: {
            out: {
                type: "stdout"
            },
            file_out_all: {
                type: 'file',
                filename: __dirname + '/../../logs/all/logs_all.log',
                maxLogSize: 25 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 100,
                compress: true
            },
            file_out_all_filter: {
                type: 'logLevelFilter',
                level: 'trace',
                appender: 'file_out_all'
            },
            file_out_trace: {
                type: 'file',
                filename: __dirname + '/../../logs/trace/logs_trace.log',
                maxLogSize: 25 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 100,
                compress: true
            },
            file_out_trace_filter: {
                type: 'logLevelFilter',
                level: 'trace',
                maxLevel: 'trace',
                appender: 'file_out_trace'
            },
            file_out_debug: {
                type: 'file',
                filename: __dirname + '/../../logs/debug/logs_debug.log',
                maxLogSize: 25 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 100,
                compress: true
            },
            file_out_debug_filter: {
                type: 'logLevelFilter',
                level: 'debug',
                maxLevel: 'debug',
                appender: 'file_out_debug'
            },
            file_out_info: {
                type: 'file',
                filename: __dirname + '/../../logs/info/logs_info.log',
                maxLogSize: 25 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 100,
                compress: true
            },
            file_out_info_filter: {
                type: 'logLevelFilter',
                level: 'info',
                maxLevel: 'info',
                appender: 'file_out_info'
            },
            file_out_warn: {
                type: 'file',
                filename: __dirname + '/../../logs/warn/logs_warn.log',
                maxLogSize: 25 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 100,
                compress: true
            },
            file_out_warn_filter: {
                type: 'logLevelFilter',
                level: 'warn',
                maxLevel: 'warn',
                appender: 'file_out_warn'
            },
            file_out_error: {
                type: 'file',
                filename: __dirname + '/../../logs/error/logs_error.log',
                maxLogSize: 25 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 100,
                compress: true
            },
            file_out_error_filter: {
                type: 'logLevelFilter',
                level: 'error',
                maxLevel: 'error',
                appender: 'file_out_error'
            },
            file_out_fatal: {
                type: 'file',
                filename: __dirname + '/../../logs/fatal/logs_fatal.log',
                maxLogSize: 25 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 100,
                compress: true
            },
            file_out_fatal_filter: {
                type: 'logLevelFilter',
                level: 'fatal',
                maxLevel: 'fatal',
                appender: 'file_out_fatal'
            }
        },
        categories: {
            default: {
                appenders: [
                    'out',
                    'file_out_all_filter',
                    'file_out_trace_filter',
                    'file_out_debug_filter',
                    'file_out_info_filter',
                    'file_out_warn_filter',
                    'file_out_error_filter',
                    'file_out_fatal_filter',
                ],
                level: "trace"
            }
        }
    },
    rate_limit: {
        windowMs: 1000 * 60 * 15,
        max: 100000,
        message: '{ "error": "Too many requests" }'
    },
    graphql: {
        path: '/graphql',
        introspection: true,
        playground: true,
        tracing: true,
        debug: true,
    },
    cost_analysis: {
        maximumCost: 120,
        defaultCost: 1
    },
    compression: {
        level: -1 // https://github.com/expressjs/compression#level
    },
    cors_enabled: true,
    port: 4000,
    maintenance_mode: {
        maintenance_mode_enabled: true,
        message: 'Sorry, we are down for maintenance',
        allowed_hosts: [
            '127.1.0.1',
            '::1',
            '::ffff:127.0.0.1'
        ]
    },
};

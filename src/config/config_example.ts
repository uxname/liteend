/* eslint-disable no-magic-numbers */
import path from 'path';

const MAX_BACKUP_SIZE = 5 * 1024 * 1024; // maximum size (in bytes) for the log file.
const MAX_BACKUP_COUNT = 100; // maximum number of log files.

export default {
    server: {
        logsServe: {
            users: {
                admin: 'MWmkGdyCkHDPpBgkdwrHWGYZ2EdHHFp5rmNGZvxBV8nNQ4svZLBjdM4LvV8bSLde'
            },
            realm: 'AT3QknJ48Ku3W2'
        },
        loggerConfig: {
            appenders: {
                out: {type: 'stdout'},
                fileOutAll: {
                    type: 'file',
                    filename: path.join(__dirname, '/../../data/logs/all/logs_all.log'),
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
                    filename: path.join(__dirname, '/../../data/logs/trace/logs_trace.log'),
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
                    filename: path.join(__dirname, '/../../data/logs/debug/logs_debug.log'),
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
                    filename: path.join(__dirname, '/../../data/logs/info/logs_info.log'),
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
                    filename: path.join(__dirname, '/../../data/logs/warn/logs_warn.log'),
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
                    filename: path.join(__dirname, '/../../data/logs/error/logs_error.log'),
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
                    filename: path.join(__dirname, '/../../data/logs/fatal/logs_fatal.log'),
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
        },
        rateLimit: {
            windowMs: 1000 * 60 * 15,
            max: 100000,
            message: '{ "error": "Too many requests" }'
        },
        graphql: {
            path: '/graphql',
            introspection: true,
            playground: true,
            tracing: process.env.NODE_ENV !== 'production',
            mocksEnabled: false,
            mocksPreserveResolvers: true,
            debug: process.env.NODE_ENV !== 'production'
        },
        costAnalysis: {
            maximumCost: 120,
            defaultCost: 1
        },
        compression: {
            level: -1 // https://github.com/expressjs/compression#level
        },
        corsEnabled: true,
        port: 4000,
        maintenanceMode: {
            enabled: false,
            message: 'Sorry, we are down for maintenance',
            allowedHosts: [
                '127.1.0.1',
                '::1',
                '::ffff:127.0.0.1'
            ]
        },
        sessionExpiresIn: 30 * 24 * 60 * 60 * 1000,
        salt: 'kmpigYcbvjfKUBJvPCEuA43LXWrTb27Qe8Xv5uGuNQ6tyAvYC354VahSKpUR5SkR',
        maxUploadFileSizeBytes: 5 * 1024 * 1024,
        uploadAllowedFileTypes: [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
            '.gif'
        ]
    },
    email: {
        host: 'smtp.ethereal.email',
        user: 'marianne.collier@ethereal.email',
        password: 'dbsrgD3q13GYBGm11B'
    },
    disableRegisterEmailConfirmation: false
};

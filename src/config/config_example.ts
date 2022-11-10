/* eslint-disable no-magic-numbers */

export default {
    server: {
        adminAuth: {
            users: {
                admin: 'MWmkGdyCkHDPpBgkdwrHWGYZ2EdHHFp5rmNGZvxBV8nNQ4svZLBjdM4LvV8bSLde'
            },
            realm: 'AT3QknJ48Ku3W2'
        },
        rateLimit: {
            windowMs: 1000,
            max: 20,
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
        sessions: {
            expiresIn: 30 * 24 * 60 * 60 * 1000,
            maxCountPerAccount: 100
        },
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
    db: {
        studioEnabled: false
    },
    email: {
        host: 'smtp.ethereal.email',
        user: 'marianne.collier@ethereal.email',
        password: 'dbsrgD3q13GYBGm11B'
    },
    disableRegisterEmailConfirmation: false
};

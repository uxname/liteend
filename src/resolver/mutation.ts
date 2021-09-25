import {AccountStatus, Resolvers} from '../generated/graphql_api';
import {getLogger} from '../tools/Logger';
import StatusCodes from '../tools/StatusCodes';
import {AuthUtils} from '../tools/AuthUtils';
import config from '../config/config';
import * as PrismaClient from '@prisma/client';
import {Email} from '../tools/Email';
import express from 'express';
import GraphQLError from '../tools/GraphQLError';
import uaParse from 'ua-parser-js';
import geoip from 'geoip-lite';

const log = getLogger('mutation');

const emailClient = new Email({host: config.email.host, user: config.email.user, password: config.email.password});

async function createNewEmailCode(email: string, prisma: PrismaClient.PrismaClient): Promise<{ result: boolean, expiresAt: Date }> {
    await prisma.emailCode.deleteMany({where: {expiresAt: {lt: new Date()}}});

    const oneTimeCode = AuthUtils.generateOneTimeCode();
    const ONE_HOUR = 3600000;
    const expiresAt = new Date(new Date().getTime() + ONE_HOUR);

    await emailClient.sendEmail({
        from: config.email.user,
        text: oneTimeCode,
        to: email,
        subject: 'Code'
    });
    log.debug(`Email code sent to: ${email}`);

    const result = !!await prisma.emailCode.upsert({
        where: {email},
        create: {code: oneTimeCode, email, expiresAt},
        update: {code: oneTimeCode, email, expiresAt}
    });
    return {
        result,
        expiresAt
    };
}

async function createNewSession(prisma: PrismaClient.PrismaClient, accountId: number, token: string, request: express.Request): Promise<PrismaClient.AccountSession> {
    const ipAddr: string = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].toString().split(', ')[0] : request.socket.remoteAddress || 'unknown';

    return await prisma.accountSession.create({
        data: {
            account: {connect: {id: accountId}},
            token,
            expiresAt: new Date(new Date().getTime() + config.server.sessionExpiresIn),
            ipAddr,
            userAgent: request.headers['user-agent']
        }
    });
}

const mutation: Resolvers = {
    Mutation: {
        echo: (parent, args) => {
            log.trace({args});
            return args.text;
        },
        register: async (parent, {email, password}, {prisma, request}) => {
            const valid = AuthUtils.validateEmailPassword({email, password});
            if (valid) {
                throw new GraphQLError({message: valid, code: StatusCodes.BAD_REQUEST, internalData: {email}});
            }

            try {
                await createNewEmailCode(email, prisma);

                const passwordHash = await AuthUtils.hash(password + config.server.salt);

                const account = await prisma.account.create({
                    data: {
                        email: email.trim().toLowerCase(),
                        passwordHash,
                        status: AccountStatus.Disabled
                    }
                });

                const token = AuthUtils.generateToken();
                const session = await createNewSession(prisma, account.id, token, request);

                const location = geoip.lookup(session.ipAddr);
                let address = '';
                if (location) {
                    address = location.country;
                    if (location.city.length > 0) {
                        address = `${address} (${location.city})`;
                    }
                }

                return {
                    account: {
                        ...account,
                        sessions: [
                            {
                                ...session,
                                userAgent: !session.userAgent ? undefined : uaParse(session.userAgent),
                                address: address.length > 0 ? address : undefined,
                                account: {
                                    ...account,
                                    status: account.status as AccountStatus
                                }
                            }
                        ],
                        status: account.status as AccountStatus
                    },
                    token
                };
            } catch (error) {
                throw new GraphQLError({
                    message: 'Account may be already exists',
                    code: StatusCodes.CONFLICT,
                    internalData: {error}
                });
            }
        },
        generateEmailCode: async (parent, {email}, {prisma}) => {
            const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!account) {
                throw new GraphQLError({
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    message: 'Account not found',
                    code: StatusCodes.NOT_FOUND,
                    internalData: {email}
                });
            }
            return await createNewEmailCode(email, prisma);
        },
        activateAccount: async (parent, {email, code}, {prisma}) => {
            const emailCode = await prisma.emailCode.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!emailCode) {
                throw new GraphQLError({
                    message: 'Code not generated',
                    code: StatusCodes.NOT_FOUND,
                    internalData: {email}
                });
            }

            const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!account) {
                throw new GraphQLError({
                    message: 'Account not found',
                    code: StatusCodes.NOT_FOUND,
                    internalData: {email}
                });
            }

            if (account.status === AccountStatus.Active) {
                throw new GraphQLError({
                    message: 'Account already active',
                    code: StatusCodes.CONFLICT,
                    internalData: {email}
                });
            }

            if (code === emailCode.code) {
                await prisma.emailCode.delete({where: {email}});

                return true;
            } else {
                throw new GraphQLError({message: 'Wrong code', code: StatusCodes.FORBIDDEN, internalData: {email}});
            }
        },
        resetPassword: async (parent, {email, emailCode, newPassword}, {prisma}) => {
            const emailCodeDb = await prisma.emailCode.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!emailCodeDb) {
                throw new GraphQLError({
                    message: 'Code not generated',
                    code: StatusCodes.NOT_FOUND,
                    internalData: {email}
                });
            }

            if (emailCode === emailCodeDb.code) {
                const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
                if (!account) {
                    throw new GraphQLError({
                        message: 'Account not found',
                        code: StatusCodes.NOT_FOUND,
                        internalData: {email}
                    });
                }

                await prisma.emailCode.delete({where: {email}});

                const passwordHash = await AuthUtils.hash(newPassword + config.server.salt);
                await prisma.account.update({where: {id: account.id}, data: {passwordHash}});

                return true;
            } else {
                throw new GraphQLError({message: 'Wrong code', code: StatusCodes.FORBIDDEN, internalData: {email}});
            }
        },
        login: async (parent, {email, password}, {prisma, request}) => {
            // todo add bruteforce protection
            const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!account) {
                throw new GraphQLError({
                    message: 'Wrong password or account not found',
                    code: StatusCodes.FORBIDDEN,
                    internalData: {
                        email
                    }
                });
            }
            if (await AuthUtils.checkHash({
                hash: account.passwordHash,
                text: password + config.server.salt
            })) {
                const token = AuthUtils.generateToken();
                const session = await createNewSession(prisma, account.id, token, request);

                const location = geoip.lookup(session.ipAddr);
                let address = '';
                if (location) {
                    address = location.country;
                    if (location.city.length > 0) {
                        address = `${address} (${location.city})`;
                    }
                }

                return {
                    account: {
                        ...account,
                        sessions: [
                            {
                                ...session,
                                userAgent: !session.userAgent ? undefined : uaParse(session.userAgent),
                                address: address.length > 0 ? address : undefined,
                                account: {
                                    ...account,
                                    status: account.status as AccountStatus
                                }
                            }
                        ],
                        status: account.status as AccountStatus
                    },
                    token
                };
            } else {
                throw new GraphQLError({
                    message: 'Wrong password or account not found',
                    code: StatusCodes.FORBIDDEN,
                    internalData: {email}
                });
            }
        },
        logout: async (parent, {sessionIds}, {prisma, session}) => {
            if (!session?.account) {
                throw new GraphQLError({message: 'Forbidden', code: StatusCodes.FORBIDDEN});
            }

            let deletedSessions: number;

            if (sessionIds && sessionIds.length > 0) {
                deletedSessions = (await prisma.accountSession.deleteMany({
                    where: {
                        AND: [
                            {
                                OR: sessionIds.map(sessionId => ({
                                    id: sessionId
                                }))
                            },
                            {account: {id: session.account.id}}
                        ]
                    }
                })).count;
            } else {
                deletedSessions = (await prisma.accountSession.deleteMany({
                    where: {
                        AND: [
                            {id: session.id},
                            {account: {id: session.account.id}}
                        ]
                    }
                })).count;
            }

            return deletedSessions > 0;
        },
        changePassword: async (parent, {password, newPassword}, {prisma, session}) => {
            if (!session?.account) {
                throw new GraphQLError({message: 'Forbidden', code: StatusCodes.FORBIDDEN});
            }
            const accountDb = await prisma.account.findFirst({where: {id: session.account.id}});

            if (!accountDb) {
                throw new GraphQLError({message: 'Account not found', code: StatusCodes.NOT_FOUND});
            }

            if (await AuthUtils.checkHash({
                hash: accountDb.passwordHash,
                text: password + config.server.salt
            })) {
                const passwordHash = await AuthUtils.hash(newPassword + config.server.salt);
                await prisma.account.update({where: {id: accountDb.id}, data: {passwordHash}});
                return true;
            } else {
                throw new GraphQLError({message: 'Wrong password', code: StatusCodes.FORBIDDEN});
            }
        }
    }
};

export default mutation;

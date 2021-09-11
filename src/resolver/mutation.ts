import {AccountStatus, Resolvers} from '../generated/graphql_api';
import {getLogger} from '../tools/Logger';
import {ApolloError} from 'apollo-server-express';
import StatusCodes from '../tools/StatusCodes';
import {AuthUtils} from '../tools/AuthUtils';
import config from '../config/config';
import {PrismaClient} from '@prisma/client';
import {Email} from '../tools/Email';

const log = getLogger('mutation');

const emailClient = new Email({host: config.email.host, user: config.email.user, password: config.email.password});

async function createNewEmailCode(email: string, prisma: PrismaClient): Promise<{ result: boolean, expiresAt: Date }> {
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

const mutation: Resolvers = {
    Mutation: {
        echo: (parent, args) => {
            log.trace({args});
            return args.text;
        },
        register: async (parent, {email, password}, {prisma}) => {
            const valid = AuthUtils.validateEmailPassword({email, password});
            if (valid) {
                throw new ApolloError(valid, String(StatusCodes.BAD_REQUEST));
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

                const token = AuthUtils.createJwtToken(account);
                return {
                    account: {
                        ...account,
                        status: account.status as AccountStatus
                    },
                    token
                };
            } catch (e) {
                log.warn(`Register "${email}" failed:`, e);
                throw new ApolloError('Account may be already exists', String(StatusCodes.CONFLICT));
            }
        },
        generateEmailCode: async (parent, {email}, {prisma}) => {
            const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!account) {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                throw new ApolloError('Account not found', String(StatusCodes.NOT_FOUND));
            }
            return await createNewEmailCode(email, prisma);
        },
        activateAccount: async (parent, {email, code}, {prisma}) => {
            const emailCode = await prisma.emailCode.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!emailCode) {
                throw new ApolloError('Code not generated', String(StatusCodes.NOT_FOUND));
            }

            let account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!account) {
                throw new ApolloError('Account not found', String(StatusCodes.NOT_FOUND));
            }

            if (account.status === AccountStatus.Active) {
                throw new ApolloError('Account already active', String(StatusCodes.CONFLICT));
            }

            if (code === emailCode.code) {
                await prisma.emailCode.delete({where: {email}});
                account = await prisma.account.update({where: {id: account.id}, data: {status: AccountStatus.Active}});

                const token = AuthUtils.createJwtToken(account);
                return {
                    account: {
                        ...account,
                        status: account.status as AccountStatus
                    },
                    token
                };
            } else {
                throw new ApolloError('Wrong code', String(StatusCodes.FORBIDDEN));
            }
        },
        resetPassword: async (parent, {email, emailCode, newPassword}, {prisma}) => {
            const emailCodeDb = await prisma.emailCode.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!emailCodeDb) {
                throw new ApolloError('Code not generated', String(StatusCodes.NOT_FOUND));
            }

            if (emailCode === emailCodeDb.code) {
                const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
                if (!account) {
                    throw new ApolloError('Account not found', String(StatusCodes.NOT_FOUND));
                }

                await prisma.emailCode.delete({where: {email}});

                const passwordHash = await AuthUtils.hash(newPassword + config.server.salt);
                await prisma.account.update({where: {id: account.id}, data: {passwordHash}});
                const token = AuthUtils.createJwtToken(account);
                return {
                    account: {
                        ...account,
                        status: account.status as AccountStatus
                    },
                    token
                };
            } else {
                throw new ApolloError('Wrong code', String(StatusCodes.FORBIDDEN));
            }
        },
        login: async (parent, {email, password}, {prisma}) => {
            const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!account) {
                throw new ApolloError('Wrong password or account not found', String(StatusCodes.FORBIDDEN));
            }
            if (await AuthUtils.checkHash({
                hash: account.passwordHash,
                text: password + config.server.salt
            })) {
                const token = AuthUtils.createJwtToken(account);
                return {
                    account: {
                        ...account,
                        status: account.status as AccountStatus
                    },
                    token
                };
            } else {
                throw new ApolloError('Wrong password or account not found', String(StatusCodes.FORBIDDEN));
            }
        },
        changePassword: async (parent, {password, newPassword}, {prisma, account}) => {
            if (!account) {
                throw new ApolloError('Forbidden', String(StatusCodes.FORBIDDEN));
            }
            const accountDb = await prisma.account.findFirst({where: {id: account.id}});

            if (!accountDb) {
                throw new ApolloError('Account not found', String(StatusCodes.NOT_FOUND));
            }

            if (await AuthUtils.checkHash({
                hash: accountDb.passwordHash,
                text: password + config.server.salt
            })) {
                const passwordHash = await AuthUtils.hash(newPassword + config.server.salt);
                await prisma.account.update({where: {id: accountDb.id}, data: {passwordHash}});
                const token = AuthUtils.createJwtToken(accountDb);
                return {
                    account: {
                        ...accountDb,
                        status: accountDb.status as AccountStatus
                    },
                    token
                };
            } else {
                throw new ApolloError('Wrong password', String(StatusCodes.FORBIDDEN));
            }
        }
    }
};

export default mutation;

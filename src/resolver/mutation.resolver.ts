import {Resolvers} from '../generated/graphql-api';
import {getLogger} from '../modules/common/logger.service';
import StatusCodes from '../modules/common/status-codes';
import {AuthUtilsService} from '../modules/common/auth-utils.service';
import config from '../config/config';
import GraphQLError from '../modules/common/graphql-error';
import {SessionsService} from '../modules/sessions.service';
import {AccountService} from '../modules/account/account.service';
import {AuthGuard} from './guard/auth.guard';
import {Email} from '../modules/common/types/email/email';

const log = getLogger('mutationResolver');

const mutationResolver: Resolvers = {
    Mutation: {
        echo: (parent, args) => {
            log.trace({args});
            return args.text;
        },
        register: async (parent, {email, password}, {prisma, request}) => {
            const valid = AuthUtilsService.validateEmailPassword({email, password});
            if (valid) {
                throw new GraphQLError({message: valid, code: StatusCodes.BAD_REQUEST, internalData: {email}});
            }

            try {
                if (!config.disableRegisterEmailConfirmation) {
                    await SessionsService.createNewEmailCode(new Email(email));
                }
                const account = await AccountService.createAccount({password, email: new Email(email)});

                return await SessionsService.generateNewAuth({prisma, account, request});
            } catch (error) {
                throw new GraphQLError({
                    message: 'Account may be already exists',
                    code: StatusCodes.CONFLICT,
                    internalData: {error}
                });
            }
        },
        generateEmailCode: async (parent, {email}) => AccountService.generateEmailCode(new Email(email)),
        activateAccount: async (parent, {email, code}) => AccountService.activate({email: new Email(email), code}),
        resetPassword: async (parent, {email, emailCode, newPassword}) => AccountService.resetPassword({
            email: new Email(email),
            emailCode,
            newPassword
        }),
        login: async (parent, {email, password}, {prisma, request}) => {
            // todo add bruteforce protection
            const account = await prisma.account.findFirst({where: {email: email.trim().toLowerCase()}});
            if (!account) {
                throw new GraphQLError({
                    message: 'Wrong password or account not found',
                    code: StatusCodes.FORBIDDEN,
                    internalData: {email}
                });
            }
            if (await AuthUtilsService.checkHash({
                hash: account.passwordHash,
                text: password + config.server.salt
            })) {
                // check if sessions limit is reached and delete the oldest sessions
                const MAX_SESSIONS = 100;
                const sessionsCount = await prisma.accountSession.count({where: {accountId: account!.id}});
                if (sessionsCount >= MAX_SESSIONS) {
                    const oldestSessions = await prisma.accountSession.findMany({
                        where: {accountId: account!.id},
                        orderBy: {createdAt: 'asc'},
                        take: sessionsCount - MAX_SESSIONS + 1,
                        select: {id: true}
                    });

                    log.trace('Deleting oldest sessions', oldestSessions);
                    await prisma.accountSession.deleteMany({where: {id: {in: oldestSessions.map(s => s.id)}}});
                }
                return await SessionsService.generateNewAuth({prisma, account, request});
            } else {
                throw new GraphQLError({
                    message: 'Wrong password or account not found',
                    code: StatusCodes.FORBIDDEN,
                    internalData: {email}
                });
            }
        },
        logout: async (parent, {sessionIds}, {session}) => {
            AuthGuard.assertIfNotAuthenticated(session);
            await AuthGuard.assertIfSessionsNotOwned(session!.id, sessionIds || [session!.id]);
            return await SessionsService.deleteSessions(sessionIds || [session!.id]);
        },
        changePassword: async (parent, {password, newPassword}, {session}) => {
            AuthGuard.assertIfNotAuthenticated(session);
            return await AccountService.changePassword(session!.account.id, password, newPassword);
        }
    }
};

export default mutationResolver;

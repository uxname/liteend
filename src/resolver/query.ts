import {AccountStatus, Resolvers} from '../generated/graphql_api';
import {getLogger} from '../core/helpers/logger.service';
import StatusCodes from '../core/helpers/status-codes';
import {prisma} from '../core/helpers/prisma.service';
import GraphQLError from '../core/helpers/graphql-error';

const log = getLogger('query');

const resolvers: Resolvers = {
    Query: {
        debug: () => {
            log.debug('debug query log');
            return {
                appName: 'LiteEnd',
                appVersion: '1.0.0',
                serverTime: new Date().toISOString(),
                uptime: process.uptime()
            };
        },
        error: () => {
            throw new GraphQLError({
                message: 'Some error',
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                internalData: {someData: 777}
            });
        },
        whoami: async (parent, args, {session}) => {
            if (!session?.account) {
                throw new GraphQLError({message: 'Forbidden', code: StatusCodes.FORBIDDEN});
            }

            const accountDb = await prisma.account.findFirst({where: {id: session.account.id}});
            if (!accountDb) {
                throw new GraphQLError({message: 'Account not found', code: StatusCodes.NOT_FOUND});
            }
            if (accountDb.status !== AccountStatus.Active) {
                throw new GraphQLError({
                    message: `Account not active. Current account status: ${accountDb.status}`,
                    code: StatusCodes.METHOD_NOT_ALLOWED
                });
            }

            return {
                ...accountDb,
                status: accountDb.status as AccountStatus
            };
        },
        currentSession: async (parent, args, {session}) => {
            if (!session) {
                throw new GraphQLError({message: 'Not found', code: StatusCodes.NOT_FOUND});
            } else {
                return session;
            }
        }
    }
};

export default resolvers;

import {Resolvers} from '../generated/graphql_api';
import {getLogger} from '../core/common/logger.service';
import StatusCodes from '../core/common/status-codes';
import GraphQLError from '../core/common/graphql-error';
import {AccountService} from '../core/auth/account.service';
import {AppInfoService} from '../core/app-info.service';

const log = getLogger('query');

const resolvers: Resolvers = {
    Query: {
        debug: () => {
            log.debug('debug query log');
            return AppInfoService.getAppInfo();
        },
        error: () => {
            throw new GraphQLError({
                message: 'Example error',
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                extension: {someExternalData: 'hello'},
                internalData: {someInternalData: 777}
            });
        },
        whoami: async (parent, args, {session}) => {
            if (!session?.account) {
                throw new GraphQLError({message: 'Forbidden', code: StatusCodes.FORBIDDEN});
            }

            return await AccountService.getAccount(session.account.id);
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

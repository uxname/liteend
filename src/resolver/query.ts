import {AccountStatus, Resolvers} from '../generated/graphql_api';
import {ApolloError} from 'apollo-server-express';
import {getLogger} from '../tools/Logger';
import StatusCodes from '../tools/StatusCodes';
import {prisma} from '../tools/Prisma';

const log = getLogger('query');

const resolvers: Resolvers = {
    Query: {
        echo: (parent, args) => {
            log.trace({args});
            return args.text;
        },
        error: () => {
            throw new ApolloError('Some error', StatusCodes.INTERNAL_SERVER_ERROR.toString());
        },
        whoami: async (parent, args, {user}) => {
            if (!user) {
                throw new ApolloError('Forbidden', String(StatusCodes.FORBIDDEN));
            }

            const account = await prisma.account.findFirst({where: {id: user.id}});
            if (!account) {
                throw new ApolloError('Account not found', String(StatusCodes.NOT_FOUND));
            }
            if (account.status !== AccountStatus.Active) {
                throw new ApolloError(`Account not active. Current account status: ${account.status}`, String(StatusCodes.METHOD_NOT_ALLOWED));
            }

            return {
                ...account,
                status: account.status as AccountStatus
            };
        }
    }
};

export default resolvers;

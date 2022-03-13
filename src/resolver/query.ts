import {AccountStatus, Resolvers} from '../generated/graphql_api';
import {getLogger} from '../tools/Logger';
import StatusCodes from '../tools/StatusCodes';
import GraphQLError from '../tools/GraphQLError';

const log = getLogger('query');

const resolvers: Resolvers = {
    Query: {
        echo: (parent, args) => {
            log.trace({args});
            return args.text;
        },
        error: () => {
            throw new GraphQLError({
                message: 'Some error',
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                internalData: {someData: 777}
            });
        },
        whoami: async (parent, args, {session, prisma}) => {
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
        },
        statisticItems: async (parent, {hardwareId, take, skip}, {prisma, session}) => {
            const result = await prisma.statisticItem.findMany({
                where: {
                    hardwareId
                },
                take,
                skip
            });

            const total = await prisma.statisticItem.count({
                where: {
                    hardwareId
                }
            });

            return {
                items: result,
                totalCount: total
            };
        }
    }
};

export default resolvers;

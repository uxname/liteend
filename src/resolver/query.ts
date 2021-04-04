import {Resolvers} from '../generated/graphql_api';
import {ApolloError} from 'apollo-server-express';
import {getLogger} from '../tools/Logger';
import StatusCodes from '../tools/StatusCodes';
const log = getLogger('query');

const resolvers: Resolvers = {
    Query: {
        echo: (parent, args, ctx, info) => {
            log.trace(ctx, info);
            return args.text;
        },
        error: () => {
            throw new ApolloError('Some error', StatusCodes.INTERNAL_SERVER_ERROR.toString());
        },
        getAllPosts: (parent, args, {prisma}) => {
            return prisma.post.findMany();
        }
    }
};

export default resolvers;

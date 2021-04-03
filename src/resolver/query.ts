import {Resolvers} from '../generated/graphql_api';
import {ApolloError} from 'apollo-server-express';

const resolvers: Resolvers = {
    Query: {
        echo: (parent, args, context, info) => {
            return args.text;
        },
        error: (parent, args, context, info) => {
            throw new ApolloError('Some error', '500');
        },
        getAllPosts: (parent, args, {prisma}, info) => {
            return prisma.post.findMany();
        }
    }
};

export default resolvers;

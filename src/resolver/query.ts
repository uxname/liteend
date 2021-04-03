import {Resolvers} from '../generated/graphql_api';
import {ApolloError} from 'apollo-server-express';

const resolvers: Resolvers = {
    Query: {
        echo: (parent, args, ctx, info) => {
            console.log(ctx, info);
            return args.text;
        },
        error: () => {
            throw new ApolloError('Some error', '500');
        },
        getAllPosts: (parent, args, {prisma}) => {
            return prisma.post.findMany();
        }
    }
};

export default resolvers;

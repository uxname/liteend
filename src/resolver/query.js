const {ApolloError} = require('apollo-server-express');

module.exports = {
    echo: (parent, args, ctx, info) => {
        console.log(ctx, info);
        return args.text;
    },
    error: () => {
        throw new ApolloError('Some error', 500);
    },
    getAllPosts: async (parent, args, {prisma}) => {
        return prisma.post.findMany();
    }
};

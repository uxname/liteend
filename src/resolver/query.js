const {ApolloError} = require('apollo-server-express');

module.exports = {
    echo: (parent, args, ctx, info) => {
        return args.text;
    },
    error: () => {
        throw new ApolloError("Some error", 500);
    },
    getAllTexts: async (parent, args, ctx) => {
        return await ctx.db.find({});
    }
};

module.exports = {
    echo: (parent, args, ctx, info) => {
        console.log(ctx, info);
        return args.text;
    },
    addPost: async (parent, {title, content}, {prisma}) => {
        await prisma.post.create({data: {title, content}});
        return true;
    }
};

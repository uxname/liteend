module.exports = {
    echo: (parent, args, ctx, info) => args.text,
    addPost: async (parent, {title, content}, {prisma}, info) => {
        await prisma.post.create({data: {title, content}});
        return true;
    }
};

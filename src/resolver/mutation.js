const cuid = require('cuid');

module.exports = {
    echo: (parent, args, ctx, info) => args.text,
    addTextToDb: async (parent, {text}, ctx, info) => {
        await ctx.db.insert({
            id: cuid(),
            text,
            date: new Date()
        });
        return true;
    }
};

import {Resolvers} from '../generated/graphql_api';
import {getLogger} from '../tools/Logger';
const log = getLogger('mutation');

const mutation: Resolvers = {
    Mutation: {
        echo: (parent, args, ctx, info) => {
            log.trace(ctx, info);
            return args.text;
        },
        addPost: async (parent, {title, content}, {prisma}) => {
            await prisma.post.create({data: {title, content}});
            return true;
        }
    }
};

export default mutation;

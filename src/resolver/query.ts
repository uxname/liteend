import {Resolvers} from '../generated/graphql_api';
import {ApolloError} from 'apollo-server-express';
import {getLogger} from '../tools/Logger';
import StatusCodes from '../tools/StatusCodes';

const log = getLogger('query');

const resolvers: Resolvers = {
    Query: {
        echo: (parent, args) => {
            log.trace({args});
            return args.text;
        },
        error: () => {
            throw new ApolloError('Some error', StatusCodes.INTERNAL_SERVER_ERROR.toString());
        },
        whoami: (parent, args, {user}) => {
            if (!user) {
                throw new ApolloError('Forbidden', String(StatusCodes.FORBIDDEN));
            }
            return user;
        }
    }
};

export default resolvers;

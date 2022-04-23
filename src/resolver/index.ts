import Query from './query';
import Mutation from './mutation';
import {Resolvers} from '../generated/graphql_api';
import {GraphQLScalarType} from 'graphql';
import {ApolloError} from 'apollo-server-express';
import StatusCodes from '../core/common/status-codes';
import {AccountService} from '../core/auth/account.service';

const resolvers: Resolvers = {
    Query: Query.Query,
    Mutation: Mutation.Mutation,
    Date: new GraphQLScalarType<Date, string>({
        name: 'Date',
        parseValue(value) {
            return new Date(value as string);
        },
        serialize(value) {
            return (value as Date).toISOString();
        }
    }),
    Account: {
        sessions: async (parent, args, {session}) => {
            if (parent.sessions) {
                return parent.sessions;
            }

            if (!session?.account) {
                throw new ApolloError('Forbidden', String(StatusCodes.FORBIDDEN));
            }

            if (!parent.id) {
                throw new ApolloError('Forbidden', String(StatusCodes.FORBIDDEN));
            }

            return await AccountService.getSessions(parent.id);
        }
    }
};
export default resolvers;

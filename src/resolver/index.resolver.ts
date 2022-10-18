import Query from './query.resolver';
import Mutation from './mutation.resolver';
import {Resolvers} from '../generated/graphql-api';
import {GraphQLScalarType} from 'graphql';
import {AccountService} from '../modules/account/account.service';
import {AuthGuard} from './guard/auth.guard';

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

            AuthGuard.assertIfNotAuthenticated(session);

            return await AccountService.getSessions(parent.id!);
        }
    }
};
export default resolvers;

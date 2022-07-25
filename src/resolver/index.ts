import Query from './query';
import Mutation from './mutation';
import {Resolvers} from '../generated/graphql_api';
import {GraphQLScalarType} from 'graphql';
import {AccountService} from '../modules/auth/account.service';
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

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return await AccountService.getSessions(parent.id!);
        }
    }
};
export default resolvers;

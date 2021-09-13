import Query from './query';
import Mutation from './mutation';
import {Resolvers} from '../generated/graphql_api';
import {GraphQLScalarType} from 'graphql';
import {ApolloError} from 'apollo-server-express';
import StatusCodes from '../tools/StatusCodes';

const resolvers: Resolvers = {
    Query: Query.Query,
    Mutation: Mutation.Mutation,
    Date: new GraphQLScalarType({
        name: 'Date',
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.toISOString();
        }
    }),
    Account: {
        sessions: async (parent, args, {prisma, session}) => {
            if (parent.sessions) {
                return parent.sessions;
            }

            if (!session?.account) {
                throw new ApolloError('Forbidden', String(StatusCodes.FORBIDDEN));
            }

            return await prisma.accountSession.findMany({where: {account: {id: parent.id}}});
        }
    }
};
export default resolvers;

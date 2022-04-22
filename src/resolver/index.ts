import Query from './query';
import Mutation from './mutation';
import {Resolvers} from '../generated/graphql_api';
import {GraphQLScalarType} from 'graphql';
import {ApolloError} from 'apollo-server-express';
import StatusCodes from '../core/helpers/status-codes';
import geoip from 'geoip-lite';
import uaParse from 'ua-parser-js';

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
        sessions: async (parent, args, {prisma, session}) => {
            if (parent.sessions) {
                return parent.sessions;
            }

            if (!session?.account) {
                throw new ApolloError('Forbidden', String(StatusCodes.FORBIDDEN));
            }

            const sessions = await prisma.accountSession.findMany({where: {account: {id: parent.id}}});
            return sessions.map(currentSession => {
                const location = geoip.lookup(currentSession.ipAddr);
                let address = '';
                if (location) {
                    address = location.country;
                    if (location.city.length > 0) {
                        address = `${address} (${location.city})`;
                    }
                }
                return ({
                    ...currentSession,
                    userAgent: !currentSession.userAgent ? undefined : uaParse(currentSession.userAgent),
                    address: address.length > 0 ? address : undefined
                });
            });
        }
    }
};
export default resolvers;

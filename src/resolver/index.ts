import Query from './query';
import Mutation from './mutation';
import {Resolvers} from '../generated/graphql_api';
import {GraphQLScalarType} from 'graphql';

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
    })
};
export default resolvers;

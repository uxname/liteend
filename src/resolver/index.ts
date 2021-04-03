import Query from './query';
import Mutation from './mutation';
import {Resolvers} from '../generated/graphql_api';

const resolvers: Resolvers = {
    Query: Query.Query,
    Mutation: Mutation.Mutation
};
export default resolvers;

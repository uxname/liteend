/* eslint-disable new-cap */
import {GraphQLClient} from 'graphql-request';
import {getSdk, Sdk} from './graphql/generated/gql_tests';
import config from '../config/config';

describe('API Tests', () => {
    let client: GraphQLClient;
    let api: Sdk;

    beforeAll(() => {
        client = new GraphQLClient(`http://127.0.0.1:${config.server.port}${config.server.graphql.path}`);
        api = getSdk(client);
    });

    test('Should make echo query', async () => {
        const text = 'Hello World';
        const result = await api.MyEcho({text});
        expect(result.echo).toEqual(text);
    });
});

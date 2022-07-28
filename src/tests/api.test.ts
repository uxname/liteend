/* eslint-disable new-cap */
import {GraphQLClient} from 'graphql-request';
import {getSdk, Sdk} from './graphql/generated/gql_tests';
import config from '../config/config';
import {prisma} from '../modules/common/prisma.service';
import * as console from 'console';

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

    test('Should reject register with weak password', async () => {
        const email = `test${Math.random()}@test.com`;
        const password = '123';
        try {
            const result = await api.RegisterAccount({email, password});
            console.debug(result);
        } catch (e) {
            const err = e as Error;
            expect(err.message).toContain('too short');
        }
    });

    test('Should register new account', async () => {
        const email = `test${Math.random()}@test.com`;
        const password = 'test1234567!';
        const result = await api.RegisterAccount({email, password});

        expect(result.register.token).not.toBeNull();
        expect(result.register.account.email).toEqual(email);

        await prisma.accountSession.deleteMany({where: {token: result.register.token}});
        await prisma.account.delete({where: {email}});
    });

    test('Should login account', async () => {
        const email = `test${Math.random()}@test.com`;
        const password = 'test123456!';
        const result = await api.RegisterAccount({email, password});

        const loginResult = await api.LoginAccount({
            email: result.register.account.email,
            password
        });
        expect(loginResult.login.token).not.toBeNull();
        expect(loginResult.login.account.email).toEqual(email);

        await prisma.accountSession.deleteMany({where: {account: {email}}});
        await prisma.account.delete({where: {email}});
    });

    test('Should logout account', async () => {
        const email = `test${Math.random()}@test.com`;
        const password = 'test123456!';
        const result = await api.RegisterAccount({email, password});

        const loginResult = await api.LoginAccount({
            email: result.register.account.email,
            password
        });

        const sessionCountBeforeLogout = await prisma.accountSession.count({where: {account: {email}}});
        const logoutResult = await api.LogoutAccount({}, {
            Authorization: `Bearer ${result.register.token}`
        });

        expect(logoutResult.logout).toBeTruthy();
        const sessionCountAfterLogout = await prisma.accountSession.count({where: {account: {email}}});
        expect(sessionCountAfterLogout).toEqual(sessionCountBeforeLogout - 1);

        await api.LogoutAccount({
            sessionIds: [loginResult.login.account.sessions![0].id]
        }, {
            Authorization: `Bearer ${loginResult.login.token}`
        });

        const sessionCountAfterLogoutWithParameters = await prisma.accountSession.count({where: {account: {email}}});

        expect(sessionCountAfterLogoutWithParameters).toEqual(0);

        await prisma.accountSession.deleteMany({where: {account: {email}}});
        await prisma.account.delete({where: {email}});
    });
});

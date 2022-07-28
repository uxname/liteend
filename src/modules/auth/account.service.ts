import {AuthUtilsService} from '../common/auth-utils.service';
import config from '../../config/config';
import {Account, AccountRole, AccountSession, AccountStatus} from '../../generated/graphql_api';
import {prisma} from '../common/prisma.service';
import GraphQLError from '../common/graphql-error';
import StatusCodes from '../common/status-codes';
import {SessionsService} from './sessions.service';
import * as PrismaClient from '@prisma/client';
import geoip from 'geoip-lite';
import uaParse from 'ua-parser-js';
import {Email} from '../common/types/email/email';

const ACCOUNT_NOT_FOUND = 'Account not found';
const CODE_NOT_GENERATED = 'Code not generated';
const WRONG_PASSWORD = 'Wrong password';

export class AccountService {
    static async createAccount(data: {password: string, email: Email}): Promise<PrismaClient.Account> {
        const passwordHash = await AuthUtilsService.hash(data.password + config.server.salt);

        return await prisma.account.create({
            data: {
                email: data.email.value,
                passwordHash,
                status: config.disableRegisterEmailConfirmation ? AccountStatus.Active : AccountStatus.Disabled,
                rolesArrayJson: JSON.stringify([AccountRole.User])
            }
        });
    }

    static async activate(data: {email: Email, code: string}): Promise<boolean> {
        const emailCode = await prisma.emailCode.findFirst({where: {email: data.email.value}});
        if (!emailCode) {
            throw new GraphQLError({
                message: CODE_NOT_GENERATED,
                code: StatusCodes.NOT_FOUND,
                internalData: {email: data.email}
            });
        }

        const account = await prisma.account.findFirst({where: {email: data.email.value}});
        if (!account) {
            throw new GraphQLError({
                message: ACCOUNT_NOT_FOUND,
                code: StatusCodes.NOT_FOUND,
                internalData: {email: data.email}
            });
        }

        if (account.status === AccountStatus.Active) {
            throw new GraphQLError({
                message: 'Account already active',
                code: StatusCodes.CONFLICT,
                internalData: {email: data.email}
            });
        }

        if (data.code === emailCode.code) {
            await prisma.emailCode.delete({where: {email: data.email.value}});

            return true;
        } else {
            throw new GraphQLError({
                message: 'Wrong code',
                code: StatusCodes.FORBIDDEN,
                internalData: {email: data.email}
            });
        }
    }

    static async generateEmailCode(email: Email): Promise<{result: boolean, expiresAt: Date}> {
        const account = await prisma.account.findFirst({where: {email: email.value}});
        if (!account) {
            throw new GraphQLError({
                message: ACCOUNT_NOT_FOUND,
                code: StatusCodes.NOT_FOUND,
                internalData: {email}
            });
        }
        return await SessionsService.createNewEmailCode(email);
    }

    static async resetPassword(data: {email: Email, emailCode: string, newPassword: string}): Promise<boolean> {
        const emailCodeDb = await prisma.emailCode.findFirst({where: {email: data.email.value}});
        if (!emailCodeDb) {
            throw new GraphQLError({
                message: CODE_NOT_GENERATED,
                code: StatusCodes.NOT_FOUND,
                internalData: {email: data.email}
            });
        }

        if (data.emailCode === emailCodeDb.code) {
            const account = await prisma.account.findFirst({where: {email: data.email.value}});
            if (!account) {
                throw new GraphQLError({
                    message: ACCOUNT_NOT_FOUND,
                    code: StatusCodes.NOT_FOUND,
                    internalData: {email: data.email}
                });
            }

            await prisma.emailCode.delete({where: {email: data.email.value}});

            const passwordHash = await AuthUtilsService.hash(data.newPassword + config.server.salt);
            await prisma.account.update({where: {id: account.id}, data: {passwordHash}});

            return true;
        } else {
            throw new GraphQLError({
                message: 'Wrong code',
                code: StatusCodes.FORBIDDEN,
                internalData: {email: data.email}
            });
        }
    }

    static async changePassword(accountId: number, password: string, newPassword: string): Promise<boolean> {
        const accountDb = await prisma.account.findFirst({where: {id: accountId}});

        if (!accountDb) {
            throw new GraphQLError({message: ACCOUNT_NOT_FOUND, code: StatusCodes.NOT_FOUND});
        }

        if (await AuthUtilsService.checkHash({
            hash: accountDb.passwordHash,
            text: password + config.server.salt
        })) {
            const passwordHash = await AuthUtilsService.hash(newPassword + config.server.salt);
            await prisma.account.update({where: {id: accountDb.id}, data: {passwordHash}});
            return true;
        } else {
            throw new GraphQLError({message: WRONG_PASSWORD, code: StatusCodes.FORBIDDEN});
        }
    }

    static async getAccount(accountId: number): Promise<Account> {
        const accountDb = await prisma.account.findFirst({where: {id: accountId}});
        if (!accountDb) {
            throw new GraphQLError({message: ACCOUNT_NOT_FOUND, code: StatusCodes.NOT_FOUND});
        }
        if (accountDb.status !== AccountStatus.Active) {
            throw new GraphQLError({
                message: `Account not active. Current account status: ${accountDb.status}`,
                code: StatusCodes.METHOD_NOT_ALLOWED
            });
        }

        return {
            ...accountDb,
            roles: JSON.parse(accountDb.rolesArrayJson) // todo move to adapter
        } as Account;
    }

    static async getSessions(accountId: number): Promise<AccountSession[]> {
        const sessions = await prisma.accountSession.findMany({where: {account: {id: accountId}}});
        return sessions.map(currentSession => {
            const location = geoip.lookup(currentSession.ipAddr);
            let address = '';
            if (location) {
                address = location.country;
                if (location.city.length > 0) {
                    address = `${address} (${location.city})`;
                }
            }
            return {
                account: {} as Account,
                ...currentSession,
                userAgent: !currentSession.userAgent ? undefined : uaParse(currentSession.userAgent),
                address: address.length > 0 ? address : undefined
            };
        });
    }

}

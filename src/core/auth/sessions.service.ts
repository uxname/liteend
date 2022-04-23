import * as PrismaClient from '@prisma/client';
import express from 'express';
import {AccountStatus, AuthResult} from '../../generated/graphql_api';
import {AuthUtilsService} from '../common/auth-utils.service';
import geoip from 'geoip-lite';
import uaParse from 'ua-parser-js';
import config from '../../config/config';
import {EmailService} from '../common/email.service';
import {getLogger} from '../common/logger.service';
import {prisma} from '../common/prisma.service';

const log = getLogger('auth service');

const emailClient = new EmailService({
    host: config.email.host,
    user: config.email.user,
    password: config.email.password
});

export class SessionsService {
    static async createNewEmailCode(email: string): Promise<{result: boolean, expiresAt: Date}> {
        await prisma.emailCode.deleteMany({where: {expiresAt: {lt: new Date()}}});

        const oneTimeCode = AuthUtilsService.generateOneTimeCode();
        const ONE_HOUR = 3600000;
        const expiresAt = new Date(new Date().getTime() + ONE_HOUR);

        await emailClient.sendEmail({
            from: config.email.user,
            text: oneTimeCode,
            to: email,
            subject: 'Code'
        });
        log.debug(`Email code sent to: ${email}`);

        const result = !!await prisma.emailCode.upsert({
            where: {email},
            create: {code: oneTimeCode, email, expiresAt},
            update: {code: oneTimeCode, email, expiresAt}
        });
        return {
            result,
            expiresAt
        };
    }

    static async generateNewAuth(input: {prisma: PrismaClient.PrismaClient, account: PrismaClient.Account, request: express.Request}): Promise<AuthResult> {
        const token = AuthUtilsService.generateToken();
        const session = await SessionsService.createNewSession({
            prisma: input.prisma,
            accountId: input.account.id,
            token,
            request: input.request
        });

        const location = geoip.lookup(session.ipAddr);
        let address = '';
        if (location) {
            address = location.country;
            if (location.city.length > 0) {
                address = `${address} (${location.city})`;
            }
        }

        return {
            account: {
                ...input.account,
                sessions: [
                    {
                        ...session,
                        userAgent: !session.userAgent ? undefined : uaParse(session.userAgent),
                        address: address.length > 0 ? address : undefined,
                        account: {
                            ...(input.account),
                            status: input.account.status as AccountStatus
                        }
                    }
                ],
                status: input.account.status as AccountStatus
            },
            token
        };
    }

    static async deleteSessions(sessionIds: number[]): Promise<boolean> {
        const deletedSessions = (await prisma.accountSession.deleteMany({
            where: {
                OR: sessionIds.map(sessionId => ({
                    id: sessionId
                }))
            }
        })).count;

        return deletedSessions > 0;
    }

    private static async createNewSession(input: {prisma: PrismaClient.PrismaClient, accountId: number, token: string, request: express.Request}): Promise<PrismaClient.AccountSession> {
        const ipAddr: string = input.request.headers['x-forwarded-for'] ? input.request.headers['x-forwarded-for'].toString().split(', ')[0] : input.request.socket.remoteAddress || 'unknown';

        return await input.prisma.accountSession.create({
            data: {
                account: {connect: {id: input.accountId}},
                token: input.token,
                expiresAt: new Date(new Date().getTime() + config.server.sessionExpiresIn),
                ipAddr,
                userAgent: input.request.headers['user-agent']
            }
        });
    }
}

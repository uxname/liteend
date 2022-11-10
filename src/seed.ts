/* eslint-disable no-magic-numbers */
import {prisma} from './modules/common/prisma.service';
import {AuthUtilsService} from './modules/common/auth-utils.service';
import promptSync from 'prompt-sync';
import config from './config/config';
import {getLogger} from './modules/common/logger.service';

const prompt = promptSync({sigint: true, eot: true});

const log = getLogger('DB seed');

async function seed() {
    const ADMIN_EMAIL = 'admin@admin.com';
    const ADMIN_PASSWORD = 'admin@admin.com';
    const ADMIN_AUTH_TOKEN = `test_token_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const sessions = await prisma.accountSession.findMany({where: {account: {email: ADMIN_EMAIL}}});
    if (sessions.length > 0) {
        const deletedSessions = await prisma.accountSession.deleteMany({where: {account: {email: ADMIN_EMAIL}}});
        log.debug(`Deleted ${deletedSessions.count} sessions`);
    }
    const account = await prisma.account.findFirst({where: {email: ADMIN_EMAIL}});
    if (account) {
        const deletedAccount = await prisma.account.delete({where: {email: ADMIN_EMAIL}});
        log.debug(`Deleted ${deletedAccount.email} account`);
    }

    await prisma.account.create({
        data: {
            email: ADMIN_EMAIL,
            passwordHash: await AuthUtilsService.hash(ADMIN_PASSWORD + config.server.salt),
            rolesArrayJson: '["admin"]',
            status: 'ACTIVE',
            sessions: {
                create: {
                    token: 'token',
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                    ipAddr: '127.0.0.1'
                }
            }
        }
    });

    log.warn(`Created account with email "${ADMIN_EMAIL}" and password "${ADMIN_PASSWORD}"`);
    log.warn(`Created session with token "${ADMIN_AUTH_TOKEN}"`);
}

async function main() {
    const answer = prompt('Are you sure you want to seed the database? It may delete all data. (y/N) ');

    if (answer !== 'y') {
        log.info('Aborting seed...');
        return;
    }
    log.info('Seeding...');
    log.info('----------------------------------------');
    await seed();
    log.info('----------------------------------------');
    log.info('Seeding done');
}

main().catch(console.error);

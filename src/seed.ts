// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-magic-numbers,unicorn/prefer-top-level-await,promise/catch-or-return */
import * as readline from 'node:readline';

import { faker } from '@faker-js/faker';
import { AccountRole, AccountStatus, PrismaClient } from '@prisma/client';

import { CryptoService } from '@/common/crypto/crypto.service';

const prisma = new PrismaClient();

async function getTextFromUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    rl.question(query, (text: string) => {
      resolve(text);
      rl.close();
    });
  });
}

const crypto = new CryptoService();

async function main() {
  const answer = await getTextFromUser(
    'Do you want to clear the database? (y/N):',
  );

  if (answer === 'y') {
    await prisma.accountSession.deleteMany({});
    await prisma.oneTimeCode.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.upload.deleteMany({});
  }

  console.log('Start seeding ...');
  const EXPIRES_AT = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const salt = process.env.SALT!;
  const password = '123';

  const newPasswordHash = await crypto.hash(password, salt);

  // Create accounts
  await prisma.account.create({
    data: {
      email: faker.internet.email().toLowerCase(),
      passwordHash: newPasswordHash,
      roles: [AccountRole.ADMIN, AccountRole.USER],
      status: AccountStatus.ACTIVE,
      avatarUrl: 'https://example.com/avatar.png',
      sessions: {
        create: {
          token: faker.random.numeric(42),
          ipAddr: faker.internet.ipv4(),
          expiresAt: EXPIRES_AT,
        },
      },
    },
  });

  await prisma.account.create({
    data: {
      email: faker.internet.email().toLowerCase(),
      passwordHash: newPasswordHash,
      roles: [AccountRole.USER],
      status: AccountStatus.ACTIVE,
      sessions: {
        create: {
          token: faker.random.numeric(42),
          ipAddr: faker.internet.ipv4(),
          expiresAt: EXPIRES_AT,
        },
      },
    },
  });

  // Create one-time codes
  await prisma.oneTimeCode.create({
    data: {
      email: faker.internet.email().toLowerCase(),
      code: faker.random.numeric(6),
      expiresAt: EXPIRES_AT,
    },
  });

  // Create uploads
  await prisma.upload.create({
    data: {
      filepath: `/path/to/upload_${faker.random.numeric(6)}.jpg`,
      originalFilename: 'upload1.jpg',
      extension: 'jpg',
      size: 1024,
      mimetype: 'image/jpeg',
      uploaderIp: '127.0.0.1',
    },
  });

  await prisma.upload.create({
    data: {
      filepath: `/path/to/upload2_${faker.random.numeric(6)}.jpg`,
      originalFilename: 'upload2.jpg',
      extension: 'jpg',
      size: 2048,
      mimetype: 'image/jpeg',
      uploaderIp: '127.0.0.1',
    },
  });

  console.log('Seeding finished.');

  const accountCount = await prisma.account.count();
  const oneTimeCodeCount = await prisma.oneTimeCode.count();
  const uploadCount = await prisma.upload.count();

  console.table({
    accountCount,
    oneTimeCodeCount,
    uploadCount,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

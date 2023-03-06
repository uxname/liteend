// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-magic-numbers,unicorn/prefer-top-level-await,promise/catch-or-return */
import { AccountRole, AccountStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');
  const EXPIRES_AT = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const RND = Math.random().toString(36).slice(2, 15);

  // Create accounts
  await prisma.account.create({
    data: {
      email: `admin_${RND}@example.com`,
      passwordHash: 'password',
      roles: [AccountRole.ADMIN, AccountRole.USER],
      status: AccountStatus.ACTIVE,
      avatarUrl: 'https://example.com/avatar.png',
      sessions: {
        create: {
          token: `token1${RND}`,
          ipAddr: '127.0.0.1',
          expiresAt: EXPIRES_AT,
        },
      },
    },
  });

  await prisma.account.create({
    data: {
      email: `user_${RND}@example.com`,
      passwordHash: 'password',
      roles: [AccountRole.USER],
      status: AccountStatus.ACTIVE,
      sessions: {
        create: {
          token: `token2${RND}`,
          ipAddr: '127.0.0.1',
          expiresAt: EXPIRES_AT,
        },
      },
    },
  });

  // Create one-time codes
  await prisma.oneTimeCode.create({
    data: {
      email: `user_${RND}@example.com`,
      code: '123456',
      expiresAt: EXPIRES_AT,
    },
  });

  // Create uploads
  await prisma.upload.create({
    data: {
      filepath: `/path/to/upload_${RND}.jpg`,
      originalFilename: 'upload1.jpg',
      extension: 'jpg',
      size: 1024,
      mimetype: 'image/jpeg',
      uploaderIp: '127.0.0.1',
    },
  });

  await prisma.upload.create({
    data: {
      filepath: `/path/to/upload2_${RND}.jpg`,
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

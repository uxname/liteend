import { PrismaClient, Upload } from '@/@generated/prisma/client';

export async function createUpload(
  prisma: PrismaClient,
  overrides?: Partial<Upload>,
): Promise<Upload> {
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return prisma.upload.create({
    data: {
      filepath: overrides?.filepath ?? `2024/01/01/test-${uniqueId}.png`,
      originalFilename: overrides?.originalFilename ?? 'test.png',
      extension: overrides?.extension ?? '.png',
      size: overrides?.size ?? 1024,
      mimetype: overrides?.mimetype ?? 'image/png',
      uploaderIp: overrides?.uploaderIp ?? '127.0.0.1',
      ...overrides,
    },
  });
}

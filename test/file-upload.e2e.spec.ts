import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaService } from '@/common/prisma/prisma.service';
import { createProfile } from './factories/profile.factory';
import { E2EClient } from './utils/e2e-client';
import { createTestingApp } from './utils/testing-app';

// Minimal valid PNG: 1x1 transparent pixel
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

describe('FileUpload (e2e)', () => {
  let client: E2EClient;
  let prisma: PrismaService;

  beforeAll(async () => {
    const { fastify, prisma: p } = await createTestingApp();
    prisma = p;
    client = new E2EClient(fastify);
  });

  it('should upload a file, write it to disk, and persist metadata to DB', async () => {
    const profile = await createProfile(prisma);
    client.loginAs(profile);

    const response = await client.uploadFile(
      '/upload',
      'test-image.png',
      PNG_1X1,
      'image/png',
    );

    expect(response.statusCode).toBe(201);

    const body = response.json() as Array<{ filename: string; path: string }>;
    expect(body).toHaveLength(1);
    const uploadedFile = body[0]!;
    expect(uploadedFile.path).toMatch(/^\/uploads\//);
    expect(uploadedFile.filename).toMatch(/\.png$/);

    const relativePath = uploadedFile.path.replace(/^\/uploads\//, '');
    const fullDiskPath = path.join(
      process.cwd(),
      'data',
      'uploads',
      relativePath,
    );
    expect(fs.existsSync(fullDiskPath)).toBe(true);

    const upload = await prisma.upload.findFirst({
      where: { filepath: relativePath },
    });
    expect(upload).not.toBeNull();
    expect(upload?.mimetype).toBe('image/png');
    expect(upload?.originalFilename).toBe('test-image.png');
    expect(upload?.extension).toBe('.png');

    fs.unlinkSync(fullDiskPath);
    if (upload) {
      await prisma.upload.delete({ where: { id: upload.id } });
    }
    await prisma.profile.delete({ where: { id: profile.id } });

    client.logout();
  });

  it('should return 400 when the request is not multipart', async () => {
    const response = await client.request({
      method: 'POST',
      url: '/upload',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify({ file: 'not-a-file' }),
    });

    expect(response.statusCode).toBe(400);
  });

  afterAll(() => {
    client.logout();
  });
});

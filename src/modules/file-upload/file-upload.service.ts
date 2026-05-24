import { randomUUID } from 'node:crypto';
import fsAsync from 'node:fs/promises';
import path from 'node:path';
import { MultipartFile } from '@fastify/multipart';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { lookup } from 'mrmime';
import { FILE_UPLOAD_TIMEOUT } from '@/common/constants';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadDir = path.join(process.cwd(), 'data', 'uploads');
  private readonly defaultMimeType = 'application/octet-stream';
  private readonly allowedMimeTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
  ]);

  constructor(private readonly prisma: PrismaService) {}

  getMimeType(filename: string): string {
    return lookup(filename) || this.defaultMimeType;
  }

  async getSafeFileInfo(relativePath: string): Promise<{
    fullPath: string;
    mimeType: string;
  }> {
    const fullPath = path.join(this.uploadDir, relativePath);
    const resolvedPath = path.resolve(fullPath);
    const resolvedRoot = path.resolve(this.uploadDir);

    if (!resolvedPath.startsWith(resolvedRoot)) {
      throw new ForbiddenException('Access denied');
    }

    try {
      await fsAsync.access(resolvedPath);
    } catch {
      throw new NotFoundException('File not found');
    }

    return {
      fullPath: resolvedPath,
      mimeType: this.getMimeType(resolvedPath),
    };
  }

  async processFile(part: MultipartFile) {
    if (!this.allowedMimeTypes.has(part.mimetype)) {
      return null;
    }

    const { fullPath, relativeDir, filename, extension } =
      await this.ensurePathsAndGenerate(part.filename);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FILE_UPLOAD_TIMEOUT);

    try {
      const buffer = await part.toBuffer();
      await fsAsync.writeFile(fullPath, buffer, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    const stats = await fsAsync.stat(fullPath);

    return {
      filename,
      path: path.join('/uploads', relativeDir, filename),
      filepath: path.join(relativeDir, filename),
      originalFilename: part.filename,
      extension,
      size: stats.size,
      mimetype: part.mimetype,
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: Because of Prisma
  async saveMetadata(files: Array<any>, ip: string) {
    if (files.length === 0) return;

    this.logger.log({
      msg: 'Files uploaded',
      count: files.length,
      filenames: files.map((f) => f.originalFilename),
    });

    await this.prisma.upload.createMany({
      data: files.map((f) => ({
        filepath: f.filepath,
        originalFilename: f.originalFilename,
        extension: f.extension,
        size: f.size,
        mimetype: f.mimetype,
        uploaderIp: ip,
      })),
    });
  }

  private async ensurePathsAndGenerate(originalFilename: string) {
    const now = new Date();
    const relativeDir = path.join(
      now.getUTCFullYear().toString(),
      String(now.getUTCMonth() + 1).padStart(2, '0'),
      String(now.getUTCDate()).padStart(2, '0'),
      `${String(now.getUTCHours()).padStart(2, '0')}-${String(now.getUTCMinutes()).padStart(2, '0')}`,
    );

    const fullDir = path.join(this.uploadDir, relativeDir);
    await fsAsync.mkdir(fullDir, { recursive: true });

    const extension = path.extname(originalFilename);
    const filename = `${randomUUID()}${extension}`;

    return {
      fullPath: path.join(fullDir, filename),
      relativeDir,
      filename,
      extension,
    };
  }
}

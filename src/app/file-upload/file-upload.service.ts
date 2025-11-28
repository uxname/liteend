import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { MultipartFile } from '@fastify/multipart';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lookup } from 'mrmime';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class FileUploadService {
  private readonly UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
  private readonly DEFAULT_MIME_TYPE = 'application/octet-stream';
  private readonly ALLOWED_MIME_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
  ]);

  constructor(private readonly prisma: PrismaService) {}

  getMimeType(filename: string): string {
    return lookup(filename) || this.DEFAULT_MIME_TYPE;
  }

  getSafeFileInfo(relativePath: string): {
    fullPath: string;
    mimeType: string;
  } {
    const fullPath = path.join(this.UPLOAD_DIR, relativePath);
    const resolvedPath = path.resolve(fullPath);
    const resolvedRoot = path.resolve(this.UPLOAD_DIR);

    if (!resolvedPath.startsWith(resolvedRoot)) {
      throw new ForbiddenException('Access denied');
    }

    if (!fs.existsSync(resolvedPath)) {
      throw new NotFoundException('File not found');
    }

    return {
      fullPath: resolvedPath,
      mimeType: this.getMimeType(resolvedPath),
    };
  }

  async processFile(part: MultipartFile) {
    if (!this.ALLOWED_MIME_TYPES.has(part.mimetype)) {
      await part.toBuffer();
      return null;
    }

    const { fullPath, relativeDir, filename, extension } = this.generatePaths(
      part.filename,
    );

    await pipeline(part.file, fs.createWriteStream(fullPath));
    const stats = fs.statSync(fullPath);

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

  async saveMetadata(files: Array<any>, ip: string) {
    if (files.length === 0) return;

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

  private generatePaths(originalFilename: string) {
    const now = new Date();
    const relativeDir = path.join(
      now.getFullYear().toString(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`,
    );

    const fullDir = path.join(this.UPLOAD_DIR, relativeDir);

    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

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

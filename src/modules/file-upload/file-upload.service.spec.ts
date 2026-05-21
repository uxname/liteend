import fsAsync from 'node:fs/promises';
import { Readable } from 'node:stream';
import type { MultipartFile } from '@fastify/multipart';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '@/common/prisma/prisma.service';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;

  const mockPrismaService = {
    upload: {
      createMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.spyOn(process, 'cwd').mockReturnValue('/test/cwd');
    vi.spyOn(fsAsync, 'stat').mockResolvedValue({
      size: 1024,
    } as never);
    vi.spyOn(fsAsync, 'mkdir').mockResolvedValue(undefined as never);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getMimeType', () => {
    it('should return correct mime type for png', () => {
      expect(service.getMimeType('image.png')).toBe('image/png');
    });

    it('should return correct mime type for jpg', () => {
      expect(service.getMimeType('image.jpg')).toBe('image/jpeg');
    });

    it('should return correct mime type for gif', () => {
      expect(service.getMimeType('image.gif')).toBe('image/gif');
    });

    it('should return correct mime type for svg', () => {
      expect(service.getMimeType('image.svg')).toBe('image/svg+xml');
    });

    it('should return correct mime type for webp', () => {
      expect(service.getMimeType('image.webp')).toBe('image/webp');
    });

    it('should return default mime type for unknown extension', () => {
      expect(service.getMimeType('file.xyz')).toBe('application/octet-stream');
    });
  });

  describe('saveMetadata', () => {
    it('should save metadata to database', async () => {
      const files = [
        {
          filepath: '2024/01/01/test.png',
          originalFilename: 'test.png',
          extension: '.png',
          size: 1024,
          mimetype: 'image/png',
        },
      ];

      await service.saveMetadata(files, '127.0.0.1');

      expect(mockPrismaService.upload.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            filepath: '2024/01/01/test.png',
            originalFilename: 'test.png',
            extension: '.png',
            size: 1024,
            mimetype: 'image/png',
            uploaderIp: '127.0.0.1',
          }),
        ],
      });
    });

    it('should not call createMany for empty files array', async () => {
      await service.saveMetadata([], '127.0.0.1');

      expect(mockPrismaService.upload.createMany).not.toHaveBeenCalled();
    });

    it('should save multiple files', async () => {
      const files = [
        {
          filepath: '2024/01/01/test1.png',
          originalFilename: 'test1.png',
          extension: '.png',
          size: 1024,
          mimetype: 'image/png',
        },
        {
          filepath: '2024/01/01/test2.jpg',
          originalFilename: 'test2.jpg',
          extension: '.jpg',
          size: 2048,
          mimetype: 'image/jpeg',
        },
      ];

      await service.saveMetadata(files, '127.0.0.1');

      expect(mockPrismaService.upload.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ filepath: '2024/01/01/test1.png' }),
          expect.objectContaining({ filepath: '2024/01/01/test2.jpg' }),
        ]),
      });
    });
  });

  describe('getSafeFileInfo', () => {
    it('should throw ForbiddenException for path traversal attempt', async () => {
      await expect(
        service.getSafeFileInfo('../../etc/passwd'),
      ).rejects.toThrow();
    });

    it('should throw NotFoundException when file does not exist', async () => {
      const accessSpy = vi
        .spyOn(fsAsync, 'access')
        .mockRejectedValue(new Error('ENOENT'));
      await expect(
        service.getSafeFileInfo('2024/01/01/image.png'),
      ).rejects.toThrow('File not found');
      accessSpy.mockRestore();
    });

    it('should return fullPath and mimeType when file exists', async () => {
      const accessSpy = vi
        .spyOn(fsAsync, 'access')
        .mockResolvedValue(undefined);
      const result = await service.getSafeFileInfo('2024/01/01/image.png');
      expect(result.fullPath).toContain('image.png');
      expect(result.mimeType).toBe('image/png');
      accessSpy.mockRestore();
    });
  });

  describe('processFile', () => {
    it('should return null for disallowed mime type', async () => {
      const mockPart = {
        type: 'file' as const,
        mimetype: 'application/octet-stream',
        filename: 'file.exe',
        fieldname: 'file',
        encoding: '7bit',
        fields: {},
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('test')),
        file: { pipe: vi.fn() },
      } as unknown as MultipartFile;

      const result = await service.processFile(mockPart);

      expect(result).toBeNull();
    });

    it('should return null for text file', async () => {
      const mockPart = {
        type: 'file' as const,
        mimetype: 'text/plain',
        filename: 'file.txt',
        fieldname: 'file',
        encoding: '7bit',
        fields: {},
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('test')),
        file: { pipe: vi.fn() },
      } as unknown as MultipartFile;

      const result = await service.processFile(mockPart);

      expect(result).toBeNull();
    });

    it('should call mkdir when upload directory does not exist', async () => {
      vi.spyOn(fsAsync, 'writeFile').mockResolvedValue(undefined as never);

      const mockPart = {
        type: 'file' as const,
        mimetype: 'image/png',
        filename: 'file.png',
        fieldname: 'file',
        encoding: '7bit',
        fields: {},
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('test')),
        file: Readable.from(Buffer.from('test')),
      } as unknown as MultipartFile;

      const result = await service.processFile(mockPart);

      expect(result).not.toBeNull();
      expect(result?.size).toBe(1024);
      expect(result?.mimetype).toBe('image/png');
    });

    it('should return file data for allowed mime type', async () => {
      vi.spyOn(fsAsync, 'writeFile').mockResolvedValue(undefined as never);

      const mockPart = {
        type: 'file' as const,
        mimetype: 'image/png',
        filename: 'file.png',
        fieldname: 'file',
        encoding: '7bit',
        fields: {},
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('test')),
        file: Readable.from(Buffer.from('test')),
      } as unknown as MultipartFile;

      const result = await service.processFile(mockPart);

      expect(result).not.toBeNull();
      expect(result?.size).toBe(1024);
      expect(result?.mimetype).toBe('image/png');
    });
  });
});

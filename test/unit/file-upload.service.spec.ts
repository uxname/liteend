import { MultipartFile } from '@fastify/multipart';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileUploadService } from '@/app/file-upload/file-upload.service';
import { PrismaService } from '@/common/prisma/prisma.service';

interface MockMultipartFile {
  mimetype: string;
  filename: string;
  toBuffer: ReturnType<typeof vi.fn>;
  file: {
    pipe: ReturnType<typeof vi.fn>;
  };
}

describe('FileUploadService', () => {
  let service: FileUploadService;

  const mockPrismaService = {
    upload: {
      createMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.spyOn(process, 'cwd').mockReturnValue('/test/cwd');

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

  describe('processFile', () => {
    it('should return null for disallowed mime type', async () => {
      const mockPart: MockMultipartFile = {
        mimetype: 'application/octet-stream',
        filename: 'file.exe',
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('test')),
        file: {
          pipe: vi.fn(),
        },
      };

      const result = await service.processFile(
        mockPart as unknown as MultipartFile,
      );

      expect(result).toBeNull();
    });

    it('should return null for text file', async () => {
      const mockPart: MockMultipartFile = {
        mimetype: 'text/plain',
        filename: 'file.txt',
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('test')),
        file: {
          pipe: vi.fn(),
        },
      };

      const result = await service.processFile(
        mockPart as unknown as MultipartFile,
      );

      expect(result).toBeNull();
    });
  });
});

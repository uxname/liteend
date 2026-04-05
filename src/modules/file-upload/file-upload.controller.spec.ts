import fs from 'node:fs';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

describe('FileUploadController', () => {
  let controller: FileUploadController;
  let service: FileUploadService;

  const mockService = {
    processFile: vi.fn(),
    saveMetadata: vi.fn(),
    getSafeFileInfo: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [{ provide: FileUploadService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: vi.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<FileUploadController>(FileUploadController);
    service = module.get<FileUploadService>(FileUploadService);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('uploadFile', () => {
    const makeReq = (isMultipart: boolean, parts: unknown[] = []) => ({
      isMultipart: vi.fn().mockReturnValue(isMultipart),
      parts: vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: async function* () {
          for (const part of parts) yield part;
        },
      }),
    });

    it('should throw BadRequestException when request is not multipart', async () => {
      const req = makeReq(false);
      await expect(
        controller.uploadFile(req as never, '1.2.3.4'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no valid files are uploaded', async () => {
      const req = makeReq(true, [
        { type: 'field', fieldname: 'name', value: 'test' },
      ]);
      await expect(
        controller.uploadFile(req as never, '1.2.3.4'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should skip parts where processFile returns null', async () => {
      mockService.processFile.mockResolvedValue(null);
      const req = makeReq(true, [{ type: 'file', filename: 'bad.exe' }]);
      await expect(
        controller.uploadFile(req as never, '1.2.3.4'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return saved files on success', async () => {
      const fileData = {
        filename: 'uuid.png',
        path: '/uploads/2024/01/01/uuid.png',
        filepath: '2024/01/01/uuid.png',
        originalFilename: 'photo.png',
        extension: '.png',
        size: 1024,
        mimetype: 'image/png',
      };
      mockService.processFile.mockResolvedValue(fileData);
      mockService.saveMetadata.mockResolvedValue(undefined);

      const req = makeReq(true, [{ type: 'file', filename: 'photo.png' }]);
      const result = await controller.uploadFile(req as never, '1.2.3.4');

      expect(result).toEqual([
        { filename: 'uuid.png', path: '/uploads/2024/01/01/uuid.png' },
      ]);
      expect(service.saveMetadata).toHaveBeenCalledWith([fileData], '1.2.3.4');
    });
  });

  describe('getFile', () => {
    it('should send the file with correct mime type', async () => {
      mockService.getSafeFileInfo.mockReturnValue({
        fullPath: '/data/uploads/2024/01/01/uuid.png',
        mimeType: 'image/png',
      });

      const fakeStream = { pipe: vi.fn() };
      vi.spyOn(fs, 'createReadStream').mockReturnValue(fakeStream as never);

      const reply = {
        type: vi.fn(),
        send: vi.fn(),
      };

      await controller.getFile('2024/01/01/uuid.png', reply as never);

      expect(reply.type).toHaveBeenCalledWith('image/png');
      expect(reply.send).toHaveBeenCalledWith(fakeStream);
    });
  });
});

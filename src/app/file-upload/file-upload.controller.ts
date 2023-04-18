// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename,unicorn/no-null,no-magic-numbers */
import fs from 'node:fs';
import path from 'node:path';
import * as process from 'node:process';

import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { FileUploadService } from '@/app/file-upload/file-upload.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RealIp } from '@/common/real-ip/real-ip.decorator';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

const storage = diskStorage({
  destination: (request, file, callback) => {
    const uploadDate = new Date();
    const year = uploadDate.getFullYear();
    const month = (uploadDate.getMonth() + 1).toString().padStart(2, '0');
    const day = uploadDate.getDate().toString().padStart(2, '0');
    const hours = uploadDate.getHours().toString().padStart(2, '0');
    const minutes = uploadDate.getMinutes().toString().padStart(2, '0');

    const uploadDirectory = path.join(
      UPLOAD_DIR,
      year.toString(),
      month,
      day,
      `${hours}-${minutes}`,
    );

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    callback(null, uploadDirectory);
  },
  filename: (request, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${uuidv4()}${extension}`);
  },
});

@Controller()
export class FileUploadController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      storage,
      fileFilter: (request, file, callback) => {
        if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/gif' ||
          file.mimetype === 'image/svg+xml' ||
          file.mimetype === 'image/webp'
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
      },
    }),
  )
  async uploadFile(
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
    },
    @RealIp() ip: string,
  ) {
    await this.prisma.upload.createMany({
      data:
        files.files?.map((file) => ({
          filepath: file.path.replace(UPLOAD_DIR, ''),
          originalFilename: file.originalname,
          extension: path.extname(file.originalname),
          size: file.size,
          mimetype: file.mimetype,
          uploaderIp: ip,
        })) ?? [],
    });
    return (
      files.files?.map((file) => ({
        filename: file.filename,
        path: file.path.replace(UPLOAD_DIR, '/uploads'),
      })) ?? []
    );
  }

  @Get('/uploads/:fileName(*)')
  async getFile(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, fileName);
    const mimeType = this.fileUploadService.getMimeType(filePath);
    response.type(mimeType);

    const stream = fs.createReadStream(filePath);

    stream.pipe(response);
  }
}

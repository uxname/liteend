/* eslint-disable security/detect-non-literal-fs-filename,unicorn/no-null,no-magic-numbers */
import * as crypto from 'node:crypto';
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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { FileUploadService } from '@/app/file-upload/file-upload.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RealIp } from '@/common/real-ip/real-ip.decorator';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

// eslint-disable-next-line sonarjs/content-length
const storage = diskStorage({
  destination: (_request, _file, callback) => {
    const uploadDate = new Date();
    const year = uploadDate.getFullYear();
    const month = String(uploadDate.getMonth() + 1).padStart(2, '0');
    const day = String(uploadDate.getDate()).padStart(2, '0');
    const hours = String(uploadDate.getHours()).padStart(2, '0');
    const minutes = String(uploadDate.getMinutes()).padStart(2, '0');

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
  filename: (_request, file, callback) => {
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
  @ApiOperation({ summary: 'Upload files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully uploaded.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      storage,
      fileFilter: (_request, file, callback) => {
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/svg+xml',
          'image/webp',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB file size limit
      },
    }),
  )
  async uploadFile(
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
    },
    @RealIp() ip: string,
  ): Promise<
    Array<{
      filename: string;
      path: string;
    }>
  > {
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

  @Get('/uploads/*filePath')
  @ApiOperation({ summary: 'Get file' })
  @ApiParam({
    name: 'filePath',
    required: true,
    description: 'The file path.',
  })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully retrieved.',
  })
  async getFile(
    @Param('filePath') filePath: string,
    @Res() response: Response,
  ): Promise<void> {
    const fullFilePath = path.join(UPLOAD_DIR, ...filePath);

    if (!fs.existsSync(fullFilePath)) {
      const randomDelay = crypto.randomInt(500, 1500);
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
      response.status(204).end();
      return;
    }

    const mimeType = this.fileUploadService.getMimeType(fullFilePath);
    response.type(mimeType);

    const stream = fs.createReadStream(fullFilePath);
    stream.pipe(response);
  }
}

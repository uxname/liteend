// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename,unicorn/no-null,no-magic-numbers */
import fs from 'node:fs';
import path from 'node:path';
import * as process from 'node:process';

import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

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

@Controller('file-upload')
export class FileUploadController {
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      storage,
      fileFilter: (request, file, callback) => {
        if (
          !/\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff|ico|avif)$/i.test(
            file.originalname,
          )
        ) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
    },
  ) {
    return (
      files.files?.map((file) => ({
        filename: file.filename,
        path: file.path.replace(UPLOAD_DIR, ''),
      })) ?? []
    );
  }
}

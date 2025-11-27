import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import * as process from 'node:process';
import { pipeline } from 'node:stream/promises';
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FileUploadService } from '@/app/file-upload/file-upload.service';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RealIp } from '@/common/real-ip/real-ip.decorator';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

@Controller()
export class FileUploadController {
  private readonly logger = new Logger(FileUploadController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully uploaded.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async uploadFile(
    @Req() req: FastifyRequest,
    @RealIp() ip: string,
  ): Promise<
    Array<{
      filename: string;
      path: string;
    }>
  > {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const savedFiles: Array<{
      filename: string;
      path: string;
      filepath: string;
      originalFilename: string;
      extension: string;
      size: number;
      mimetype: string;
    }> = [];

    const parts = req.parts();

    for await (const part of parts) {
      if (part.type === 'file') {
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/svg+xml',
          'image/webp',
        ];

        if (!allowedMimeTypes.includes(part.mimetype)) {
          // Важно: в Fastify Multipart нужно вычитывать поток до конца, даже если ошибка,
          // иначе зависнет весь запрос.
          await part.toBuffer();
          continue;
          // Или throw new BadRequestException, но тогда нужно убедиться, что стрим закрыт
        }

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

        const extension = path.extname(part.filename);
        const filename = `${randomUUID()}${extension}`;
        const fullPath = path.join(uploadDirectory, filename);

        // Сохраняем файл
        await pipeline(part.file, fs.createWriteStream(fullPath));

        // Получаем размер файла
        const stats = fs.statSync(fullPath);

        savedFiles.push({
          filename: filename,
          path: fullPath.replace(UPLOAD_DIR, '/uploads'), // URL path
          filepath: fullPath.replace(UPLOAD_DIR, ''), // DB path relative to UPLOAD_DIR
          originalFilename: part.filename,
          extension: extension,
          size: stats.size,
          mimetype: part.mimetype,
        });
      }
    }

    if (savedFiles.length === 0) {
      throw new BadRequestException('No valid files uploaded');
    }

    await this.prisma.upload.createMany({
      data: savedFiles.map((f) => ({
        filepath: f.filepath,
        originalFilename: f.originalFilename,
        extension: f.extension,
        size: f.size,
        mimetype: f.mimetype,
        uploaderIp: ip ?? 'unknown',
      })),
    });

    return savedFiles.map((f) => ({
      filename: f.filename,
      path: f.path,
    }));
  }

  // Было: @Get('/uploads/*filepath')
  @Get('/uploads/*')
  @ApiOperation({ summary: 'Get file' })
  @ApiParam({
    name: '*', // Для Swagger, хотя он может ругаться, но для Fastify важно имя параметра
    required: true,
    description: 'The file path.',
  })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully retrieved.',
  })
  async getFile(
    // Было: @Param('filepath')
    @Param('*') filePathParam: string,
    @Res() response: FastifyReply,
  ): Promise<void> {
    const fullFilePath = path.join(UPLOAD_DIR, filePathParam);

    // Остальной код без изменений...
    const resolvedPath = path.resolve(fullFilePath);

    if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
      this.logger.warn(
        `Attempt to access file outside of upload directory: ${fullFilePath}`,
      );
      response.code(403).send('Forbidden');
      return;
    }

    if (!fs.existsSync(fullFilePath)) {
      const randomDelay = Math.floor(Math.random() * 1000) + 500;
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
      response.code(404).send();
      return;
    }

    const mimeType = this.fileUploadService.getMimeType(fullFilePath);
    response.type(mimeType);

    const stream = fs.createReadStream(fullFilePath);
    response.send(stream);
  }
}

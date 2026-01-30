import fs from 'node:fs';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FileUploadService } from '@/app/file-upload/file-upload.service';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { RealIp } from '@/common/real-ip/real-ip.decorator';

@Controller()
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Files uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async uploadFile(@Req() req: FastifyRequest, @RealIp() ip: string) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const savedFiles = [];
    const parts = req.parts();

    for await (const part of parts) {
      if (part.type === 'file') {
        const fileData = await this.fileUploadService.processFile(part);
        if (fileData) {
          savedFiles.push(fileData);
        }
      }
    }

    if (savedFiles.length === 0) {
      throw new BadRequestException('No valid files uploaded');
    }

    await this.fileUploadService.saveMetadata(savedFiles, ip ?? 'unknown');

    return savedFiles.map((f) => ({
      filename: f.filename,
      path: f.path,
    }));
  }

  @Get('/uploads/*')
  @ApiOperation({ summary: 'Get file' })
  @ApiParam({ name: '*', required: true, description: 'The file path.' })
  @ApiResponse({ status: 200, description: 'File retrieved.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async getFile(
    @Param('*') filePathParam: string,
    @Res() response: FastifyReply,
  ) {
    const { fullPath, mimeType } =
      this.fileUploadService.getSafeFileInfo(filePathParam);

    response.type(mimeType);
    response.send(fs.createReadStream(fullPath));
  }
}

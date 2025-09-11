import * as fs from 'node:fs';
import path from 'node:path';

import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '@/common/logger-serve/auth/auth.guard';

@Controller('logs')
export class LoggerServeController {
  private readonly logsDirectory = path.join(process.cwd(), 'data', 'logs');

  // Utility function to validate that the requested file is within the logs directory
  private isValidFilePath(filePath: string): boolean {
    const absolutePath = path.resolve(this.logsDirectory, filePath);
    return absolutePath.startsWith(this.logsDirectory); // Prevent directory traversal
  }

  @UseGuards(AuthGuard)
  @Get('*filepath')
  async getFile(
    @Param('filepath') _filepath: string,
    @Query('invert') invert: string,
    @Res() response: Response,
  ): Promise<void> {
    const filepath = path.join(..._filepath);
    // Ensure that the file path is valid
    if (!this.isValidFilePath(filepath)) {
      response.status(HttpStatus.FORBIDDEN).send('Access denied');
      return;
    }

    response.set('Content-Type', 'text/plain');
    const absolutePath = path.join(this.logsDirectory, filepath);

    try {
      await fs.promises.access(absolutePath);
    } catch {
      response.status(HttpStatus.NOT_FOUND).send('File not found');
      return;
    }

    const stats = await fs.promises.stat(absolutePath);

    if (stats.isDirectory()) {
      const files = await fs.promises.readdir(absolutePath);
      response.send(files.join('\n'));
    } else {
      const fileStream = fs.createReadStream(absolutePath);
      if (invert === 'true') {
        let data = '';
        fileStream.on('data', (chunk) => {
          data += chunk;
        });
        fileStream.on('end', () => {
          const invertedData = data.split('\n').reverse().join('\n');
          response.send(invertedData);
        });
        fileStream.on('error', (error) => {
          response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(`Error reading file: ${error.message}`);
        });
      } else {
        fileStream.pipe(response);
      }
    }
  }
}

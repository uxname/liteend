// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any,security/detect-non-literal-fs-filename */
import * as fs from 'node:fs';
import * as path from 'node:path';

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

  @UseGuards(AuthGuard)
  @Get(':filepath(*)')
  async getFile(
    @Param('filepath') filepath: string,
    @Query('invert') invert: string,
    @Res() response: Response,
  ) {
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
      } else {
        fileStream.pipe(response);
      }
    }
  }
}

import * as fs from 'node:fs';
import path from 'node:path';

import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '@/common/logger-serve/auth/auth.guard';
import { LOGGER_UI_HTML } from './logger-ui.html';

@Controller('logs')
@UseGuards(AuthGuard)
export class LoggerServeController {
  private readonly logger = new Logger(LoggerServeController.name);
  private readonly logsDirectory = path.join(process.cwd(), 'data', 'logs');

  // 1. Serve UI (No Cache)
  @Get()
  async getDashboard(@Res() response: Response): Promise<void> {
    response.header('Content-Type', 'text/html');
    // Prevent browser caching to ensure JS updates are applied immediately
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Pragma', 'no-cache');
    response.header('Expires', '0');

    response.send(LOGGER_UI_HTML);
  }

  // 2. List Files
  @Get('api/list')
  async getFilesList(@Res() response: Response): Promise<void> {
    // Disable cache for API too
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');

    try {
      const files = await this.scanDir(this.logsDirectory);

      if (files.length === 0) {
        this.logger.warn(
          `No log files found in directory: ${this.logsDirectory}`,
        );
      }

      const relativeFiles = files.map((f) =>
        path.relative(this.logsDirectory, f).replace(/\\/g, '/'),
      );

      relativeFiles.sort();

      response.json(relativeFiles);
    } catch (error) {
      this.logger.error('Error listing files:', error);
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Unable to list files' });
    }
  }

  // 3. Get Content
  @Get('file/*filepath')
  async getFileContent(
    @Param('filepath') _filepath: string | string[],
    @Query('start') startQuery: string,
    @Res() response: Response,
  ): Promise<void> {
    const requestPath = Array.isArray(_filepath)
      ? _filepath.join('/')
      : _filepath;

    await this.serveFile(requestPath, startQuery, response);
  }

  // --- Helpers ---

  private isValidFilePath(filePath: string): boolean {
    const absolutePath = path.resolve(this.logsDirectory, filePath);
    return absolutePath.startsWith(this.logsDirectory);
  }

  private async serveFile(
    filepath: string,
    startQuery: string,
    response: Response,
  ): Promise<void> {
    if (!this.isValidFilePath(filepath)) {
      response.status(HttpStatus.FORBIDDEN).send('Access denied');
      return;
    }

    const absolutePath = path.join(this.logsDirectory, filepath);

    try {
      const stats = await fs.promises.stat(absolutePath);

      if (stats.isDirectory()) {
        response.status(HttpStatus.BAD_REQUEST).send('Is a directory');
        return;
      }

      let start = Number.parseInt(startQuery || '0', 10);
      if (Number.isNaN(start)) start = 0;

      const totalSize = stats.size;

      if (start > totalSize) start = 0;

      response.setHeader('X-File-Size', totalSize.toString());
      response.setHeader('Content-Type', 'text/plain');
      response.setHeader('Cache-Control', 'no-cache');

      if (start === totalSize) {
        response.send('');
        return;
      }

      const stream = fs.createReadStream(absolutePath, {
        start: start,
        encoding: 'utf8',
      });

      stream.on('error', (err) => {
        this.logger.error(`Stream error: ${err.message}`);
        if (!response.headersSent) response.end();
      });

      stream.pipe(response);
    } catch {
      response.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }

  private async scanDir(dir: string): Promise<string[]> {
    const results: string[] = [];
    try {
      await fs.promises.access(dir);
      const list = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const item of list) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          const subFiles = await this.scanDir(fullPath);
          results.push(...subFiles);
        } else if (item.isFile() && !item.name.startsWith('.')) {
          results.push(fullPath);
        }
      }
    } catch {
      // It is normal if the directory doesn't exist yet
      return [];
    }
    return results;
  }
}

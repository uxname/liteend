import {
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { renderDevLauncherView } from './dev-launcher.view';
import { tools } from './tools';

@Controller('dev')
export class DevLauncherController {
  private readonly logger = new Logger(DevLauncherController.name);
  private cachedHtml?: string;
  private lastBuild?: number;
  private readonly ttlMs = 300_000;

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-cache, private')
  getDevPage(): string {
    if (!this.cachedHtml || this.isExpired()) {
      try {
        this.cachedHtml = this.buildHtml();
        this.lastBuild = Date.now();
      } catch (error) {
        this.logger.error('View render failed', (error as Error).stack);
        throw new InternalServerErrorException();
      }
    }

    return this.cachedHtml;
  }

  private isExpired(): boolean {
    const now = Date.now();
    if (this.lastBuild === undefined) return true;
    return now - this.lastBuild > this.ttlMs;
  }

  private buildHtml(): string {
    return renderDevLauncherView({
      heroTitle: 'Dev Ops Control Room',
      heroSubtitle: 'Unified infrastructure access and environment management.',
      heroNote: 'Infra-Level Access Only',
      tools,
    });
  }
}

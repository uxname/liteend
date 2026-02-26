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

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-cache, private')
  getDevPage(): string {
    if (!this.cachedHtml) {
      try {
        this.cachedHtml = this.buildHtml();
      } catch (error) {
        this.logger.error('View render failed', (error as Error).stack);
        throw new InternalServerErrorException();
      }
    }

    return this.cachedHtml;
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

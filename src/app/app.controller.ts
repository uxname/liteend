import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EasyconfigService } from 'nestjs-easyconfig';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: EasyconfigService,
  ) {
    const logger = new Logger(AppController.name);
    logger.warn('Controller initiated, port:', config.get('PORT'));
  }

  @Get()
  getHello(): string {
    this.appService.getHello();
    return this.appService.getHello();
  }
}

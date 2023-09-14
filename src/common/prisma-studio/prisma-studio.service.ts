import { exec } from 'node:child_process';

import { Injectable } from '@nestjs/common';

import { Logger } from '@/common/logger/logger';

@Injectable()
export class PrismaStudioService {
  private readonly logger = new Logger(PrismaStudioService.name);

  async startStudio(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      exec('npm run db:studio-local', (error, stdout, stderr) => {
        if (error) {
          this.logger.error('Command execution error:', error);
          return reject(error);
        }

        this.logger.log('Command execution stdout:', stdout);
        this.logger.error('Command execution stderr:', stderr);
        return resolve();
      });
    });
  }
}

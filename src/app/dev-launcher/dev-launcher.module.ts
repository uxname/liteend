import { Module } from '@nestjs/common';
import { DevLauncherController } from './dev-launcher.controller';

@Module({
  controllers: [DevLauncherController],
})
export class DevLauncherModule {}

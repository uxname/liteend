import { Module } from '@nestjs/common';

import { Logger } from '@/common/logger/logger';

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}

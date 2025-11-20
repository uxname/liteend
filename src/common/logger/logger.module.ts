import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { pinoConfig } from '@/common/logger/pino-config';

@Global()
@Module({
  imports: [PinoLoggerModule.forRoot(pinoConfig)],
})
export class LoggerModule {}

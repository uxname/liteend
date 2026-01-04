import pino, { Logger as PinoInstance } from 'pino';

export class Logger {
  private readonly instance: PinoInstance;

  constructor(config: { name: string }) {
    const isDev = process.env.NODE_ENV !== 'production';

    this.instance = pino({
      name: config.name,
      level: process.env.LOG_LEVEL || 'info',
      transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    });
  }

  private formatArgs(args: unknown[]): Record<string, unknown> | undefined {
    if (args.length === 0) return undefined;
    if (args.length === 1 && typeof args[0] === 'object') {
      return args[0] as Record<string, unknown>;
    }
    return { extra: args };
  }

  debug(msg: string, ...args: unknown[]): void {
    const payload = this.formatArgs(args);
    payload ? this.instance.debug(payload, msg) : this.instance.debug(msg);
  }

  info(msg: string, ...args: unknown[]): void {
    const payload = this.formatArgs(args);
    payload ? this.instance.info(payload, msg) : this.instance.info(msg);
  }

  warn(msg: string, ...args: unknown[]): void {
    const payload = this.formatArgs(args);
    payload ? this.instance.warn(payload, msg) : this.instance.warn(msg);
  }

  error(msg: string, ...args: unknown[]): void {
    const payload = this.formatArgs(args);
    payload ? this.instance.error(payload, msg) : this.instance.error(msg);
  }

  critical(msg: string, ...args: unknown[]): void {
    const payload = this.formatArgs(args);
    payload ? this.instance.fatal(payload, msg) : this.instance.fatal(msg);
  }
}

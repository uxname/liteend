/* eslint-disable unicorn/no-null,no-magic-numbers,security/detect-object-injection */
enum LogLevel {
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

enum LogFormat {
  PLAIN = 'plain',
  JSON = 'json',
}

interface LoggerConfig {
  name: string;
  level?: LogLevel;
  logTime?: boolean;
  useColors?: boolean;
  format?: LogFormat;
}

export class Logger {
  private readonly level: LogLevel;
  private readonly name: string;
  private readonly logTime: boolean;
  private readonly useColors: boolean;
  private readonly format: LogFormat;

  private readonly colors = {
    info: '\u001B[32m', // green
    warn: '\u001B[33m', // yellow
    error: '\u001B[31m', // red
    reset: '\u001B[0m', // reset
  };

  constructor(config: LoggerConfig) {
    this.name = config.name;
    this.level = config.level ?? LogLevel.INFO;
    this.logTime = config.logTime ?? true;
    this.useColors = config.useColors ?? true;
    this.format = config.format ?? LogFormat.PLAIN;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private getLevelKey(level: LogLevel): keyof typeof this.colors {
    switch (level) {
      case LogLevel.INFO: {
        return 'info';
      }
      case LogLevel.WARN: {
        return 'warn';
      }
      case LogLevel.ERROR: {
        return 'error';
      }
      default: {
        throw new Error(`Unknown log level: ${level}`);
      }
    }
  }

  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.INFO: {
        return 'INFO';
      }
      case LogLevel.WARN: {
        return 'WARN';
      }
      case LogLevel.ERROR: {
        return 'ERROR';
      }
      default: {
        throw new Error(`Unknown log level: ${level}`);
      }
    }
  }

  private formatMessage(level: LogLevel, ...arguments_: unknown[]): string {
    const timestamp = this.logTime ? new Date().toISOString() : undefined;
    const levelKey = this.getLevelKey(level);
    const levelColor = this.useColors ? this.colors[levelKey] : '';
    const resetColor = this.useColors ? this.colors.reset : '';
    const levelName = this.getLevelName(level);

    if (this.format === LogFormat.JSON) {
      const logObject = {
        timestamp,
        name: this.name,
        level: levelName,
        message: arguments_
          .map((argument) => this.serialize(argument))
          .join(' '),
      };
      return JSON.stringify(logObject);
    }

    const parts = [
      timestamp && `[${timestamp}]`,
      `[${this.name}]`,
      `[${levelName}]`,
      ...arguments_.map((argument) => this.serialize(argument)),
    ];

    const message = parts.filter(Boolean).join(' ');

    return this.useColors ? `${levelColor}${message}${resetColor}` : message;
  }

  private serialize(argument: unknown): string {
    try {
      if (
        typeof argument === 'object' &&
        argument !== null &&
        !Array.isArray(argument)
      ) {
        const sanitizedArgument = this.sanitize(
          argument as Record<string, unknown>,
        );
        return JSON.stringify(sanitizedArgument, undefined, 2);
      }
      return String(argument);
    } catch (error) {
      return `Serialization error: ${error}`;
    }
  }

  private sanitize(object: Record<string, unknown>): Record<string, unknown> {
    const sensitiveKeys = new Set(['password', 'token', 'secret']);
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(object)) {
      if (!sensitiveKeys.has(key)) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private log(level: LogLevel, ...arguments_: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, ...arguments_);
    if (level === LogLevel.ERROR) {
      console.error(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }

  public info(...arguments_: unknown[]): void {
    this.log(LogLevel.INFO, ...arguments_);
  }

  public warn(...arguments_: unknown[]): void {
    this.log(LogLevel.WARN, ...arguments_);
  }

  public error(...arguments_: unknown[]): void {
    this.log(LogLevel.ERROR, ...arguments_);
  }
}

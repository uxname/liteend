/* eslint-disable unicorn/no-null,no-magic-numbers,security/detect-object-injection */
import { inspect } from 'node:util';

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
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
    debug: '\u001B[36m', // cyan
    info: '\u001B[32m', // green
    warn: '\u001B[33m', // yellow
    error: '\u001B[31m', // red
    critical: '\u001B[35m', // magenta
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
      case LogLevel.DEBUG: {
        return 'debug';
      }
      case LogLevel.INFO: {
        return 'info';
      }
      case LogLevel.WARN: {
        return 'warn';
      }
      case LogLevel.ERROR: {
        return 'error';
      }
      case LogLevel.CRITICAL: {
        return 'critical';
      }
      default: {
        throw new Error(`Unknown log level: ${level}`);
      }
    }
  }

  private getLevelName(level: LogLevel): string {
    return LogLevel[level] || 'UNKNOWN';
  }

  private formatMessage(level: LogLevel, ...messages: unknown[]): string {
    const timestamp = this.logTime ? new Date().toISOString() : undefined;
    const levelKey = this.getLevelKey(level);
    const levelColor = this.useColors ? this.colors[levelKey] : '';
    const resetColor = this.useColors ? this.colors.reset : '';
    const levelName = this.getLevelName(level);

    const message = messages
      .map((message_) => this.serialize(message_))
      .join(' ');

    if (this.format === LogFormat.JSON) {
      const logObject = {
        timestamp,
        name: this.name,
        level: levelName,
        message,
      };
      return JSON.stringify(logObject);
    }

    const parts = [
      timestamp && `[${timestamp}]`,
      `[${this.name}]`,
      `[${levelName}]`,
      message,
    ];

    const formattedMessage = parts.filter(Boolean).join(' ');
    return this.useColors
      ? `${levelColor}${formattedMessage}${resetColor}`
      : formattedMessage;
  }

  private serialize(data: unknown): string {
    try {
      if (typeof data === 'object' && data !== null) {
        return inspect(data, { colors: this.useColors, depth: 2 });
      }
      return String(data);
    } catch (error) {
      return `Serialization error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private log(level: LogLevel, ...messages: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, ...messages);
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL: {
        console.error(formattedMessage);
        break;
      }
      case LogLevel.WARN: {
        console.warn(formattedMessage);
        break;
      }
      default: {
        console.log(formattedMessage);
      }
    }
  }

  public debug(...messages: unknown[]): void {
    this.log(LogLevel.DEBUG, ...messages);
  }

  public info(...messages: unknown[]): void {
    this.log(LogLevel.INFO, ...messages);
  }

  public warn(...messages: unknown[]): void {
    this.log(LogLevel.WARN, ...messages);
  }

  public error(...messages: unknown[]): void {
    this.log(LogLevel.ERROR, ...messages);
  }

  public critical(...messages: unknown[]): void {
    this.log(LogLevel.CRITICAL, ...messages);
  }
}

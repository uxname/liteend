/* eslint-disable unicorn/no-null,no-magic-numbers,security/detect-object-injection */
type LogLevel = 'info' | 'warn' | 'error';
type LogFormat = 'plain' | 'json';

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

  private readonly levelPriority = {
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(config: LoggerConfig) {
    this.name = config.name;
    this.level = config.level ?? 'info';
    this.logTime = config.logTime ?? true;
    this.useColors = config.useColors ?? true;
    this.format = config.format ?? 'plain';
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.level];
  }

  private formatMessage(level: LogLevel, ...arguments_: unknown[]): string {
    const timestamp = this.logTime ? new Date().toISOString() : undefined;
    const levelColor = this.useColors ? this.colors[level] : '';
    const resetColor = this.useColors ? this.colors.reset : '';

    if (this.format === 'json') {
      return JSON.stringify({
        timestamp,
        name: this.name,
        level,
        message: arguments_
          .map((argument) => this.serialize(argument))
          .join(' '),
      });
    }

    const parts = [
      timestamp && `[${timestamp}]`,
      `[${this.name}]`,
      `[${level.toUpperCase()}]`,
      ...arguments_.map((argument) => this.serialize(argument)),
    ];

    const message = parts.filter(Boolean).join(' ');

    return this.useColors ? `${levelColor}${message}${resetColor}` : message;
  }

  private serialize(argument: unknown): string {
    if (typeof argument === 'object' && argument !== null) {
      return JSON.stringify(argument, null, 2); // Pretty-print objects
    }
    return String(argument); // Convert other types to string
  }

  private log(level: LogLevel, ...arguments_: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, ...arguments_);
    console.log(formattedMessage);
  }

  public info(...arguments_: unknown[]): void {
    this.log('info', ...arguments_);
  }

  public warn(...arguments_: unknown[]): void {
    this.log('warn', ...arguments_);
  }

  public error(...arguments_: unknown[]): void {
    this.log('error', ...arguments_);
  }
}

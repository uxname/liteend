import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'credentials',
  'cookie',
];

@Injectable()
export class GqlLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<string>() !== 'graphql') {
      return next.handle();
    }

    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const args = gqlContext.getArgs();

    const parentType = info.parentType?.name || 'Unknown';
    const fieldName = info.fieldName;

    this.logger.assign({
      graphql: {
        type: parentType,
        operation: fieldName,
        args: this.redact(args),
      },
    });

    this.logger.info(`GraphQL ${parentType}: ${fieldName}`);

    return next.handle();
  }

  private redact(args: unknown): unknown {
    if (!args || typeof args !== 'object') {
      return args;
    }

    if (Array.isArray(args)) {
      return args.map((item) => this.redact(item));
    }

    const redactedObj: Record<string, unknown> = {};
    const source = args as Record<string, unknown>;

    for (const key of Object.keys(source)) {
      const value = source[key];
      const isSensitive = SENSITIVE_KEYS.some((s) =>
        key.toLowerCase().includes(s),
      );

      if (isSensitive) {
        redactedObj[key] = '[REDACTED]';
      } else if (value !== null && typeof value === 'object') {
        redactedObj[key] = this.redact(value);
      } else {
        redactedObj[key] = value;
      }
    }

    return redactedObj;
  }
}

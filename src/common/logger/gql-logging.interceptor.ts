import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'credentials',
  'cookie',
  'sig',
];

@Injectable()
export class GqlLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(GqlLoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return next.handle();
    }

    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const args = gqlContext.getArgs();
    const req = gqlContext.getContext().req;

    if (!req) return next.handle();

    const graphqlData = {
      type: info.parentType?.name || 'Unknown',
      operation: info.fieldName,
      args: this.redact(args),
    };

    // Привязываем данные к запросу для использования в pino-config
    req.graphql = graphqlData;
    if (req.raw) {
      (req.raw as any).graphql = graphqlData;
    }

    return next.handle();
  }

  private redact(args: unknown): unknown {
    if (!args || typeof args !== 'object') return args;
    if (Array.isArray(args)) return args.map((v) => this.redact(v));

    const redactedObj: Record<string, unknown> = {};
    for (const key of Object.keys(args as object)) {
      const value = (args as any)[key];
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

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'credentials',
  'cookie',
  'sig',
];

const MAX_RESPONSE_BYTES = 4096;
const MAX_ARRAY_ELEMENTS = 5;

function truncateResponse(
  data: unknown,
  maxBytes: number = MAX_RESPONSE_BYTES,
  maxArrayItems: number = MAX_ARRAY_ELEMENTS,
): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    return data.length > maxBytes
      ? `${data.slice(0, maxBytes)}...truncated (${data.length} bytes total)`
      : data;
  }
  if (Array.isArray(data)) {
    if (data.length <= maxArrayItems)
      return data.map((v) => truncateResponse(v, maxBytes, maxArrayItems));
    return [
      ...data
        .slice(0, maxArrayItems)
        .map((v) => truncateResponse(v, maxBytes, maxArrayItems)),
      `[... +${data.length - maxArrayItems} items]`,
    ];
  }
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    const jsonStr = JSON.stringify(data);
    if (jsonStr.length > maxBytes) {
      const truncated = jsonStr.slice(0, maxBytes);
      return JSON.parse(truncated) as object;
    }
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      result[key] = truncateResponse(value, maxBytes, maxArrayItems);
    }
    return result;
  }
  return data;
}

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

    const req = gqlContext.getContext().req as {
      graphql?: Record<string, unknown>;
      raw?: { graphql?: Record<string, unknown> };
    };

    if (!req) return next.handle();

    const graphqlData: Record<string, unknown> = {
      type: info.parentType?.name || 'Unknown',
      operation: info.fieldName,
      args: this.redact(args),
    };

    req.graphql = graphqlData;
    if (req.raw) {
      req.raw.graphql = graphqlData;
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          graphqlData.response = truncateResponse(data);
          graphqlData.responseTime = Date.now() - startTime;
        },
        error: (error) => {
          graphqlData.error =
            error instanceof Error ? error.message : 'Unknown error';
          graphqlData.responseTime = Date.now() - startTime;
        },
      }),
    );
  }

  private redact(args: unknown): unknown {
    if (!args || typeof args !== 'object') return args;
    if (Array.isArray(args)) return args.map((v) => this.redact(v));

    const redactedObj: Record<string, unknown> = {};
    const argsObj = args as Record<string, unknown>;

    for (const key of Object.keys(argsObj)) {
      const value = argsObj[key];
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

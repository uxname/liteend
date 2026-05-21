# Audit Report: Error Handling & Resiliency — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| ERR-01 | Ошибки не проглатываются — catch-блоки обрабатывают или пробрасывают | ❌ FAIL | High | `AllExceptionsFilter` (строка 34): `if (host.getType() !== 'http') return;` — в контекстах `graphql` / `ws` исключение молча игнорируется. `RedisHealthIndicator` (строка 27): `catch (_error)` — ошибка проглатывается, но для healthcheck это допустимо. | Необходимо переписать `AllExceptionsFilter` так, чтобы для `graphql` контекста пробрасывать ошибку через `gqlErrorFormatter`, или логировать её, а не молча возвращать. Для `ws` добавить хотя бы `logger.error`. | Нет |
| ERR-02 | Внутренние детали (stack trace, пути, версии) не попадают в ответы | ⚠️ WARN | High | `gqlErrorFormatter` (строка 117-119): для неизвестных ошибок используется `originalError.message` в ответе — если оригинальная ошибка содержит sensitive data, она утечёт. REST-фильтр (строка 159-163): для не-HttpException ошибок сообщение жёстко задано `'An unexpected error occurred'` — безопасно. Pino-конфиг (строка 156-177): чувствительные поля редоктятся. | В `gqlErrorFormatter` для production-режима заменить `originalError.message` на `'Internal Server Error'`. | ✅ Да |
| ERR-03 | Async handlers корректно пробрасывают исключения в error middleware | ✅ PASS | High | Все resolver'ы и controller'ы используют `async/await`. `ProfileService.updateProfile` — await + Prisma exception пробрасывается. `FileUploadController.uploadFile` — async/await с проверками. `JwtAuthGuard.canActivate` — Promise-based. `TestQueueProcessor.process` — async без try-catch, ошибки уходят в BullMQ (корректно). | Не требуется. | — |
| ERR-04 | Unhandled rejections и uncaught exceptions имеют process-level обработчики | ❌ FAIL | High | В `main.ts` (строка 38) есть только `bootstrap().catch(...)` — это ловит ошибки только при старте. **Нет** `process.on('unhandledRejection', ...)` и `process.on('uncaughtException', ...)` ни в одном файле всего репозитория (включая скрипты). | Добавить в `main.ts` глобальные обработчики, которые логируют через Pino и корректно завершают процесс (с exit code 1). | ✅ Да |
| ERR-05 | Внешние вызовы (HTTP-клиенты, DB) имеют явные таймауты | ❌ FAIL | High | `PrismaService` (строка 28): создаётся с `{ adapter }` — нет `connectionTimeout` / `queryTimeout`. `RedisService` (строка 17): `new Redis({ host, port, password })` — нет `connectTimeout` / `retryStrategy`. `ofetch` в `prisma-studio.service.ts` (строка 73): нет `timeout`. BullMQ (строка 85-98 в `app.module.ts`): только Redis connection, нет `defaultJobOptions` с таймаутами. | Добавить явные таймауты: Prisma → `connectionTimeout: 10000`, ioredis → `connectTimeout: 5000, retryStrategy: ...`, ofetch → `timeout: 10000`. | Нет |
| ERR-06 | Graceful shutdown реализован — SIGTERM обрабатывается | ✅ PASS | Medium | `setup-app.ts` (строка 47): `app.enableShutdownHooks()` — NestJS автоматически обрабатывает SIGTERM/SIGINT. `PrismaService` (строка 35-37): `onModuleDestroy` → `$disconnect()`. `RedisService` (строка 24-26): `onModuleDestroy` → `client.quit()`. BullMQ Worker'ы управляются NestJS и корректно останавливаются. Docker HEALTHCHECK использует отдельный процесс (healthcheck.sh), не мешает shutdown. | Рекомендуется: добавить кастомный `process.on('SIGTERM')` с логом и `app.close()` с таймаутом 30s, чтобы гарантировать завершение при зависших хуках. | Нет |
| ERR-07 | Error responses консистентны по структуре во всём приложении | ✅ PASS | High | REST: `{ statusCode, timestamp, requestId, error, message, details? }` — единообразно. GraphQL: использует стандартный GraphQL error format `{ message, locations, path, extensions: { code, requestId, details? } }`. Healthcheck: terminus standard. Различие REST ↔ GraphQL оправдано спецификациями. | Не требуется. | — |
| ERR-08 | Retry-стратегии используют exponential backoff с jitter | ❌ FAIL | High | BullMQ `forRootAsync` не определяет `defaultJobOptions`. **Нет** параметров `attempts`, `backoff`, `removeOnComplete`, `removeOnFail`. Нет кастомных retry-механизмов с exponential backoff/jitter. | Добавить `defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }` в конфигурацию BullMQ. | Нет |
| ERR-09 | AbortSignal/CancellationToken пробрасывается во внешние вызовы | ❌ FAIL | High | Во всём `src/` нет ни одного использования `AbortController`/`AbortSignal`. Prisma queries, Redis, `ofetch`, `pipeline` — нигде не передаётся сигнал отмены. | Внедрить `AbortController` в сервисы с длительными операциями (file-upload pipeline, prisma-studio ofetch) и пробрасывать его через `AbortSignal`. Для Prisma использовать `$extends` с поддержкой сигналов. | Нет |

## Audit Coverage

- ✅ **ERR-03** — Async error propagation: PASS. Все async handlers корректно пробрасывают ошибки. Контроллеры и резолверы не содержат бизнес-логики.
- ✅ **ERR-06** — Graceful shutdown: PASS. NestJS shutdown hooks включены, жизненные хуки Prisma и Redis реализованы.
- ✅ **ERR-07** — Consistent error responses: PASS. REST и GraphQL имеют консистентные, но разные (по спецификации) форматы ошибок.

- ⚠️ **ERR-02** — Internal details leak: WARN. GraphQL error formatter в fallback-ветке может просочить `originalError.message` в production. Требуется минимальное исправление.

- ❌ **ERR-01** — Swallowed exceptions: FAIL. `AllExceptionsFilter` игнорирует не-HTTP контексты.
- ❌ **ERR-04** — Process-level handlers: FAIL. Отсутствуют `unhandledRejection`/`uncaughtException`.
- ❌ **ERR-05** — Explicit timeouts: FAIL. Ни один внешний вызов не имеет таймаута.
- ❌ **ERR-08** — Retry strategies: FAIL. Нет exponential backoff / jitter.
- ❌ **ERR-09** — AbortSignal propagation: FAIL. Нет механизмов отмены операций.

### Итого

| Метрика | Значение |
|---------|----------|
| Всего проверок | 9 |
| PASS | 3 (33%) |
| WARN | 1 (11%) |
| FAIL | 5 (56%) |

### Приоритеты исправления

1. **P0 — Critical** (должно быть исправлено в первую очередь):
   - ERR-04: `unhandledRejection`/`uncaughtException` обработчики в `main.ts`
   - ERR-05: таймауты для Prisma, Redis, external HTTP вызовов

2. **P1 — High**:
   - ERR-01: не-HTTP контексты в `AllExceptionsFilter`
   - ERR-08: retry-стратегии для BullMQ

3. **P2 — Medium**:
   - ERR-02: защита `originalError.message` в GraphQL error formatter
   - ERR-09: AbortSignal пропагация

4. **P3 — Low**:
   - ERR-06: опционально — кастомный SIGTERM handler с таймаутом

### Baseline

Текущий baseline (`docs/audit-baseline.yml`):
```yaml
accepted: []
```
Все замечания новые, ни одно не принято.

# Audit Report: Error Handling & Resiliency — 2026-05-22 11:43

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| ERR-01 | Ошибки не проглатываются — catch-блоки обрабатывают или пробрасывают | ❌ FAIL 🟡 | High | `src/common/auth/auth.service.ts:28`, `:47` — `.catch(() => {});` и `src/modules/profile/profile.service.ts:27` — `.catch(() => {});` — Redis операции (set/del) тихо проглатывают все ошибки без логирования. Cache silently stale при отказе Redis. | **1. Заменить `.catch(() => {})` на `.catch((err) => this.logger.warn({ msg: 'Redis cache failed', err }))`** \\ 2. Вынести Redis-cache операции в отдельный метод с логированием и `try/catch` \\ 3. Оставить как есть — документировать что cache loss tolerant, но это risk | Да (заменены на logger.warn) |
| ERR-01 | Ошибки не проглатываются | ❌ FAIL 🟡 | High | `src/common/auth/auth.service.ts:16,36` — `JSON.parse(cached)` — если в Redis лежит битая строка (например, ручной ввод), `JSON.parse` кинет исключение. Оно пробросится в PassportStrategy.validate → UnauthorizedException, но 500 не будет. | **1. Оборачивать `JSON.parse` в try/catch — при ошибке парсинга удалять ключ из Redis и перезапрашивать из БД** \\ 2. Использовать `safeJsonParse` утилиту с fallback \\ 3. Оставить — низкая вероятность, что кто-то вручную испортит Redis | Да (try/catch + del + refetch) |
| ERR-02 | Внутренние детали (stack trace, пути, версии) не попадают в ответы | ✅ PASS | High | `src/common/all-exceptions-filter.ts:168-172` — для неизвестных ошибок возвращает `'An unexpected error occurred'`, без stack trace. `src/common/graphql/error-formatter.ts:118-126` — аналогично, `'Internal Server Error'` без деталей. | — | — |
| ERR-03 | Async handlers корректно пробрасывают исключения в error middleware | ✅ PASS | High | NestJS использует global filters (`AllExceptionsFilter`) и GraphQL error formatter (`gqlErrorFormatter`). Все исключения из сервисов/контроллеров/резолверов попадают в централизованный обработчик. | — | — |
| ERR-04 | Unhandled rejections и uncaught exceptions имеют process-level обработчики | ❌ FAIL 🟠 | High | `src/main.ts:12-20` — обработчики есть, но используют `console.error` вместо Logger (ok для bootstrap), и что важнее — вызывают `process.exit(1)` без graceful shutdown: не закрываются DB/REDIS соединения, не дожидаются текущих запросов. | **1. В `unhandledRejection`/`uncaughtException` вызывать `app.close()` перед `process.exit(1)`, чтобы закрыть пулы** \\ 2. Использовать NestJS `ShutdownObserver` / lifecycle hooks вместо прямого `process.exit` \\ 3. Оставить — при таких ошибках процесс в нестабильном состоянии, exit оправдан | Нет |
| ERR-05 | Внешние вызовы (HTTP-клиенты, DB) имеют явные таймауты | ✅ PASS | High | `src/common/prisma/prisma.service.ts:31-32` — connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000. `src/common/redis/redis.service.ts:21-22` — connectTimeout: 10000. `src/modules/file-upload/file-upload.service.ts:66-67` — AbortController с 30s timeout для записи файла. | — | — |
| ERR-06 | Graceful shutdown реализован — SIGTERM обрабатывается | ❌ FAIL 🟠 | Medium | `src/bootstrap/setup-app.ts:80` — `app.enableShutdownHooks()` включён. `PrismaService.onModuleDestroy` и `RedisService.onModuleDestroy` корректно закрывают соединения. Но `src/main.ts:13,18` — `unhandledRejection`/`uncaughtException` вызывают `process.exit(1)` без вызова `app.close()`, что не даёт shutdown hooks отработать. | **1. В обработчиках `unhandledRejection`/`uncaughtException` получить app reference и вызвать `app.close()` перед `process.exit(1)`** \\ 2. Использовать NestJS `@nestjs/bull`/`@nestjs/bullmq` graceful shutdown hooks \\ 3. Оставить — exit при крашнутых ошибках быстрее, потери соединений некритичны | Нет |
| ERR-07 | Error responses консистентны по структуре во всём приложении | ✅ PASS | High | REST: `{ statusCode, timestamp, requestId, error, message, details? }` (AllExceptionsFilter). GraphQL: `{ message, locations, path, extensions: { code, requestId, details? } }` (gqlErrorFormatter). Оба используют `requestId` для трейсинга. | — | — |
| ERR-08 | Retry-стратегии используют exponential backoff с jitter | ❌ FAIL 🟡 | High | `src/common/prisma/prisma.service.ts:51` — retry delay: `Math.min(attempt * 1000, 5000)` — линейный backoff, нет jitter. `src/common/redis/redis.service.ts:23-24` — retry: `Math.min(times * 200, 3000)` — линейный backoff, нет jitter. При массовом отказе БД все ретраи синхронизируются (thundering herd). | **1. Добавить jitter: `delay = Math.min(attempt * 1000, 5000) * (0.5 + Math.random() * 0.5)`** \\ 2. Использовать библиотеку `p-retry` с `{ factor: 2, jitter: true }` \\ 3. Оставить — линейный backoff работает для простого реконнекта, jitter не критичен | Да (jitter добавлен в Prisma и Redis retry) |
| ERR-09 | AbortSignal/CancellationToken пробрасывается во внешние вызовы | 🔍 UNVERIFIED | Low | Только `src/modules/file-upload/file-upload.service.ts:66` использует AbortController. Redis и Prisma используют свои внутренние timeout-механизмы. Статический анализ не может подтвердить проброс AbortSignal во все внешние вызовы. | — | — |
| ERR-10 * | Логирование ошибок в не-NestJS контекстах использует `console.*` вместо Logger | ❌ FAIL 🟢 | Medium | `src/main.ts:13,18` — `console.error` в process-обработчиках — допустимо (Logger ещё не инициализирован). Но `src/common/git-commit-saver.ts:21,33,46` — `console.error` в утилите, которая не является частью NestJS DI, что может привести к неконсистентному формату логов. | **1. Заменить `console.*` в git-commit-saver.ts на `Logger` из `@nestjs/common`** \\ 2. Переписать git-commit-saver как injectable-сервис и использовать pino-logger \\ 3. Оставить — консоль допустима для build-time скриптов | Нет |

\* — Дополнительная проверка вне стандартного чеклиста, соответствует ERR-01 (error не проглатывается, но логирование неконсистентно).

## Итого

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 2 |
| 🟡 Medium | 3 |
| 🟢 Low | 1 |
| ✅ PASS | 4 |
| 🔍 UNVERIFIED | 1 |

## Основные проблемы

1. **🟠 Отсутствие graceful shutdown при crash** — `unhandledRejection`/`uncaughtException` делают exit(1) без `app.close()`
2. **🟠 Тихое проглатывание Redis ошибок** — 3 места с `.catch(() => {})`, потери событий кеша
3. **🟡 JSON.parse без защиты** — в auth.service Redis-кеш может содержать битый JSON
4. **🟡 Retry без jitter** — Prisma и Redis retry-linear, thundering herd risk
5. **🟡 Слабый unhandled rejection handler** — console.error вместо Logger, нет попытки закрыть соединения

## Audit Coverage

**Проверено:** src/common/auth/**, src/common/prisma/**, src/common/redis/**, src/common/all-exceptions-filter.ts, src/common/graphql/error-formatter.ts, src/common/logger/**, src/common/constants.ts, src/modules/profile/**, src/modules/file-upload/**, src/infrastructure/health/**, src/infrastructure/test-queue/**, src/bootstrap/setup-app.ts, src/main.ts

**Пропущено:** test/**, src/dev-tools/**, src/db-backup-tool/**

**Файлов проверено:** 25 | **Пропущено:** 15+

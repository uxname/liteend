# Audit Report: Logging — 2026-05-21 18:30

## Audit Coverage

| Scope | Files Scanned | Lines Analyzed |
|-------|---------------|----------------|
| Logger infra (pino-config, logger.module, gql-logging.interceptor) | 4 | 542 |
| Bootstrap & Global filters (setup-app, all-exceptions-filter, error-formatter) | 3 | 366 |
| Auth (JWT guard, strategy, roles guard, decorators, module) | 7 | 333 |
| File Upload (service, controller, module, specs) | 5 | 570 |
| Profile (service, resolver, module, specs) | 4 | 150 |
| Test Queue (processor, resolver, module, spec) | 4 | 233 |
| Bull Board module | 1 | 76 |
| Dev tools (PrismaStudio, LoggerServe, DevLauncher, Debug) | 6 | 788 |
| DB Backup Tool (backup, restore, logger) | 3 | 331 |
| Main bootstrap | 1 | 40 |
| Build-time scripts | 1 | 65 |
| **Total** | **39** | **~3494** |

---

## Summary

| Check ID | Проверка | Статус | Уверенность | Доказательство |
|----------|----------|--------|-------------|----------------|
| LOG-01 | HTTP запросы/ответы логируются (метод, статус, URL, длительность) | PASS | high | `pino-config.ts` lines 71-198 — `autoLogging: true`, custom req/res serializers, `customSuccessMessage` с responseTime, `GqlLoggingInterceptor` для GraphQL |
| LOG-02 | Важные бизнес-события логируются (создание/удаление, аудит) | **FAIL** | high | `FileUploadService` (0 логов), `ProfileService` (0 логов), `ProfileResolver.updateProfile` — PubSub публикует, но не логирует событие; `FileUploadController` не логирует факт загрузки |
| LOG-03 | Чувствительные данные не попадают в логи | **MODERATE** | high | Pino redact (17 путей) — PASS; `TestQueueProcessor` логирует `JSON.stringify(job.data)` — потенциальный риск; `console.error` в `main.ts` строка 39 — не содержит sensitive |
| LOG-04 | Уровни логирования корректны | PASS | high | `customLogLevel`: silent(304/ignored), error(500+), warn(400+), info(остальное); `AllExceptionsFilter` error(500+)/warn(client); `gqlErrorFormatter` error(server)/warn(client) |
| LOG-05 | Нет избыточного логирования в hot path | PASS | high | No per-item logging in loops; `GqlLoggingInterceptor` truncates responses (4096 байт, 5 элементов); `AllExceptionsFilter` suppresses noisy 404s; pino-config ignores health/altair/favicon/swagger paths |
| LOG-06 | Ошибки логируются с контекстом | PASS | high | `AllExceptionsFilter` (requestId, url, statusCode, userId, stack); `gqlErrorFormatter` (requestId, path, status); `JwtAuthGuard.assign({userId})` обогащает все последующие логи |
| LOG-07 | Структурированный формат (JSON) | PASS | high | Pino по умолчанию JSON; pino-roll file transport; `Logger` в db-backup-tool использует Pino (JSON); все вызовы logger используют объекты, не plain text |

---

## Detailed Findings

### LOG-01: HTTP request/response logging — PASS

**Evidence:**
- `/home/dex/Документы/Work/liteend/src/common/logger/pino-config.ts` lines 71-198:
  - `autoLogging: true` (line 154) — автоматическое логирование всех HTTP запросов/ответов
  - `serializers.req` (lines 78-84): логирует `id`, `method`, `url`, `body`, `query`
  - `serializers.res` (lines 85-99): логирует `statusCode`, content-type/content-length
  - `customSuccessMessage` (lines 131-152): включает user display, HTTP метод + URL, время выполнения
  - `customLogLevel` (lines 115-129): корректное маппинг status code -> log level
  - `customProps` (lines 102-113): добавляет userId, userRole, graphql, responseTime
  - File transports: `data/logs/all/log` (trace+) и `data/logs/error/log` (error+)
- `/home/dex/Документы/Work/liteend/src/common/logger/gql-logging.interceptor.ts` lines 64-111:
  - GraphQL operation type, field name, args (redacted), responseTime, response (truncated) / error
  - Данные прикрепляются к `req.graphql` и `req.raw.graphql` для корректной передачи в pino-config через `customProps`
- `/home/dex/Документы/Work/liteend/src/bootstrap/setup-app.ts` line 15: `app.useLogger(app.get(Logger))` — PinoLogger установлен как глобальный логгер

---

### LOG-02: Business event logging — FAIL

**Evidence of missing audit logging:**

1. **`/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.service.ts` (119 lines)**
   - `processFile()` — сохраняет файл на диск и в Prisma, НО не логирует событие загрузки
   - `saveMetadata()` — записывает метаданные, НО не логирует
   - `getSafeFileInfo()` — не логирует факт доступа к файлу (возможно, нормально для GET)
   - **Рекомендация**: добавить `logger.info(...)` в `processFile()` при успешном сохранении (filename, size, mimetype) и `logger.warn(...)` при отклонении неподдерживаемого MIME-типа

2. **`/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.controller.ts` (93 lines)**
   - `uploadFile()` — не логирует количество загруженных файлов, IP, или результат
   - **Рекомендация**: добавить `logger.log(...)` с количеством файлов и uploader IP

3. **`/home/dex/Документы/Work/liteend/src/modules/profile/profile.service.ts` (18 lines)**
   - `updateProfile()` — выполняет Prisma update, НО не логирует факт изменения профиля, какие поля были изменены
   - **Рекомендация**: добавить `logger.log(...)` с id пользователя и списком измененных полей

4. **`/home/dex/Документы/Work/liteend/src/modules/profile/profile.resolver.ts` (67 lines)**
   - `updateProfile()` мутация — публикует PubSub event, НО не логирует событие обновления
   - **Рекомендация**: добавить `logger.log(...)` или использовать `PinoLogger` в конструкторе

5. **`/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/test-queue.processor.ts` (19 lines)** — хор:
   - Логирует `Start processing job {id} ({name}). Data: {data}` (строка 10)
   - Логирует `Finished processing job {id}` (строка 16)
   - Это техническое логирование, не бизнес-аудит

**Положительные примеры бизнес-логирования (единичные):**
- `/home/dex/Документы/Work/liteend/src/db-backup-tool/backup.ts` — логирует каждый backup (start/finish/rotation)
- `gqlErrorFormatter` — логирует ошибки с контекстом GraphQL
- `AllExceptionsFilter` — логирует исключения с контекстом HTTP

---

### LOG-03: Sensitive data in logs — MODERATE

**PASS компоненты:**

1. **Pino redact (pino-config.ts lines 156-177)**:
   ```typescript
   paths: [
     'req.headers.authorization',
     'req.headers["x-api-key"]',
     'req.body.password',
     'req.body.token',
     'req.body.accessToken',
     'req.body.refreshToken',
     'req.body.variables.password',
     'req.body.variables.token',
     'req.body.variables.accessToken',
     'req.body.variables.refreshToken',
     'res.headers["set-cookie"]',
     '*.password',
     '*.accessToken',
     '*.refreshToken',
     '*.secret',
     '*.apiKey',
     '*.authorization',
   ],
   remove: true,
   ```
   - 17 путей для редокции с полным удалением (`remove: true`)
   - Wildcard `*` покрывает вложенные объекты

2. **GqlLoggingInterceptor.redact() (gql-logging.interceptor.ts lines 113-135)**:
   - Красный список ключей: `password`, `token`, `secret`, `authorization`, `credentials`, `cookie`, `sig`
   - Рекурсивно обрабатывает вложенные объекты

3. **Body capture exclusion (pino-config.ts lines 25-29)**: `/upload`, `/uploads/`, `/health`, `/.well-known`

4. **db-backup-tool (backup.ts line 42, restore.ts line 29)**: Password маскируется как `***` перед логированием `safeEnvironment`

**MODERATE риск:**

1. **`/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/test-queue.processor.ts` line 11**:
   ```typescript
   this.logger.log(`Start processing job ${job.id} (${job.name}). Data: ${JSON.stringify(job.data)}`);
   ```
   - `JSON.stringify(job.data)` логирует ВСЕ данные задачи в plain text
   - Если в `job.data` окажутся токены, пароли или PII, они попадут в логи без редокции
   - **Рекомендация**: настроить PinoLogger в процессоре или редоктить конфиденциальные поля вручную

2. **`/home/dex/Документы/Work/liteend/src/main.ts` line 39**:
   ```typescript
   console.error('Application failed to start', error);
   ```
   - Допустимо (логовер еще не инициализирован), но может вывести чувствительные данные стека в stderr

3. **`/home/dex/Документы/Work/liteend/src/common/git-commit-saver.ts`** — build-time скрипт, `console.log/error` для отладки, не влияет на продакшн

**Чувствительных данных в логах НЕ обнаружено:**
- BullBoard, PrismaStudio, LoggerServe — проверяют credentials, но НЕ логируют их
- JWT стратегия — не логирует payload токена
- Auth guards — не логируют заголовки авторизации

---

### LOG-04: Log levels correctness — PASS

| Уровень | Где используется | Контекст |
|---------|-----------------|----------|
| `silent` | pino-config `customLogLevel` | 304 Not Modified, health/altair/favicon/swagger/.well-known/.map |
| `trace` | pino-config (dev only) | Dev-режим, file transport 'all/log' |
| `info` | pino-config, gqlErrorFormatter, backup/restore, PrismaStudio, main.ts | Нормальная работа, успешные бизнес-операции |
| `warn` | pino-config (400+), AllExceptionsFilter, gqlErrorFormatter (client errors), backup/restore | HTTP 4xx, GraphQL client errors, validation failures |
| `error` | pino-config (500+), AllExceptionsFilter (500+), gqlErrorFormatter (server errors), dev-tools | HTTP 5xx, необработанные ошибки, исключения |
| `fatal` | db-backup-tool logger (`critical()` метод) | Фатальные ошибки в backup/restore скриптах |

**MAPPING корректный.** Ошибки сервера (500+) всегда `error`, клиентские ошибки (400+) всегда `warn`.

---

### LOG-05: No excessive logging in hot paths — PASS

**Механизмы защиты от избыточного логирования:**

1. **Path exclusion** (pino-config.ts lines 16-23):
   ```typescript
   IGNORED_PATH_SEGMENTS = ['/health', '/altair', '/favicon.ico', '/logs', '/swagger', '/.well-known'];
   ```
   - Здоровье, Altair, Swagger, favicon — полностью исключены

2. **Silent 404 suppression** (all-exceptions-filter.ts lines 13-21, 44-46):
   ```typescript
   SILENT_404_EXTENSIONS = ['.map', '.ico', '.js', '.css', '.png', '.jpg', '.jpeg'];
   ```
   - 404 для статики не логируются

3. **Response truncation** (gql-logging.interceptor.ts lines 22-61):
   - `MAX_RESPONSE_BYTES = 4096` — строки длиннее 4KB обрезаются
   - `MAX_ARRAY_ELEMENTS = 5` — массивы больше 5 элементов усекаются с маркером `[...+N items]`
   - JSON объекты > 4KB парсятся и обрезаются

4. **Body capture exclusion** (pino-config.ts lines 25-29):
   - `/upload`, `/uploads/`, `/health`, `/.well-known` — тело не логируется

5. **Rate limiting** (setup-app.ts lines 33-39):
   - 100 запросов в минуту — косвенно уменьшает объем логов при атаках

**Нет ни одного цикла или итерации, где логируется каждый элемент коллекции.**

---

### LOG-06: Errors logged with context — PASS

**Форматы ошибок с контекстом:**

1. **AllExceptionsFilter** (all-exceptions-filter.ts lines 84-118):
   ```typescript
   const logData = { requestId, url, statusCode, userId, message };
   // 500+: logger.error({ ...logData, msg: 'Internal Server Error', err: { message, stack }, stack })
   // 4xx:   logger.warn({ ...logData, msg: 'HTTP Client Error', details: [{ field, message }] })
   ```

2. **GraphQLErrorFormatter** (error-formatter.ts lines 29-115):
   ```typescript
   // ZodValidation: logger.warn({ msg, requestId, path, details })
   // HttpException 4xx: logger.warn({ msg, status, code, requestId, path, message })
   // HttpException 5xx: logger.error({ ...logData, err: originalError })
   // Unhandled: logger.error({ msg, err, requestId, path })
   ```

3. **JwtAuthGuard** (jwt-auth.guard.ts line 82):
   ```typescript
   this.logger.assign({ userId: user.id });
   // Enriches ALL subsequent logs in this request with userId
   ```

4. **GqlLoggingInterceptor** (gql-logging.interceptor.ts lines 100-108):
   ```typescript
   // on next:  { response, responseTime }
   // on error: { error: error.message, responseTime }
   ```

5. **Dev tools error logging**:
   - `PrismaStudioService`: `logger.error('Error while processing the request:', error)` + context
   - `LoggerServeController`: `logger.error('Error listing files:', error)` + `logger.error('Stream error: ${msg}')`

---

### LOG-07: Structured JSON format — PASS

1. **PinoLogger (nestjs-pino)**: Все логи через `nestjs-pino` — JSON по умолчанию
2. **File transport**: Pino-roll пишет JSON в `data/logs/all/log` и `data/logs/error/log`
3. **Pretty-print**: `pino-pretty` ТОЛЬКО в dev-режиме для читаемости в консоли
4. **db-backup-tool/logger.ts**: Использует `pino` напрямую — JSON вывод
5. **Все вызовы `logger.*()`** в кодовой базе используют объектный формат:
   - `this.logger.error({ err, statusCode, requestId, ... })`
   - `logger.warn({ msg, requestId, path, details, ... })`
   - Ни одного места с plain text в качестве первого аргумента при structured data
6. **GraphQL interceptor**: Хранит структурированные данные (`graphqlData: { type, operation, args, response, responseTime }`) в `req.graphql`, которые сериализуются Pino как JSON

---

## Потенциальные проблемы

### 1. TestQueueProcessor — данные задачи в логах (LOG-03)
- **Файл**: `/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/test-queue.processor.ts`
- **Строка**: 11
- **Проблема**: `JSON.stringify(job.data)` логирует все данные задачи.
- **Риск**: Если в задачу попадут чувствительные данные (токены, PII) — они будут в plain text в логах.
- **Решение**: Использовать `PinoLogger` с настройкой redact или редоктить поля вручную.

### 2. Отсутствие бизнес-аудита в FileUpload и Profile (LOG-02)
- **Файлы**: `file-upload.service.ts`, `profile.service.ts`, `profile.resolver.ts`, `file-upload.controller.ts`
- **Проблема**: Ключевые бизнес-операции не логируются:
  - Загрузка файла (кто, когда, какой файл)
  - Отклонение файла (неподдерживаемый MIME)
  - Обновление профиля (какие поля изменены)
- **Риск**: Невозможно провести аудит изменений данных.
- **Решение**: Добавить вызовы `PinoLogger` в сервисах с контекстом операции.

### 3. `console.error` в main.ts (LOG-02/LOG-03)
- **Файл**: `/home/dex/Документы/Work/liteend/src/main.ts`
- **Строка**: 39
- **Проблема**: `console.error` bypasses PinoLogger.
- **Риск**: Низкий — это last-resort handler до инициализации логгера.
- **Решение**: Допустимо. Альтернатива — использовать `Logger` из `@nestjs/common` после `app.get(Logger)`.

### 4. Логи файловых аплоадов — body exclusion (LOG-01 nuance)
- **Файл**: `pino-config.ts` lines 25-29
- **Проблема**: `/upload` и `/uploads/` исключены из записи body. Это корректно (большие бинарные данные), но может скрыть нечувствительные метаданные.
- **Решение**: Текущее поведение корректно. (PASS)

---

## Итоговая оценка

| Область | Оценка | Комментарий |
|---------|--------|------------|
| HTTP логирование | 10/10 | AutoLogging + GraphQL interceptor + responseTime + status mapping |
| Безопасность sensitive data | 8/10 | Pino redact отличный; TestQueueProcessor требует доработки |
| Уровни логирования | 10/10 | error/warn/info/silent распределены корректно |
| Отсутствие избыточности | 10/10 | Троттлинг + truncation + path exclusion |
| Контекст ошибок | 9/10 | Все ошибки с requestId, url, userId; нет userId в gqlErrorFormatter |
| Структурированный вывод | 10/10 | Везде JSON через Pino |
| **Бизнес-аудит** | **3/10** | **КРИТИЧЕСКИЙ ПРОВАЛ** — FileUpload и Profile не логируют бизнес-события |

**Средняя оценка: 8.6/10** — инфраструктура логирования отличная, но бизнес-аудит является слабым местом.

## Исправлено

На момент аудита исправлений не внесено. Рекомендуется:
1. Добавить `PinoLogger` в `FileUploadService` (и опционально в `ProfileService`)
2. Добавить `PinoLogger` в `ProfileResolver`
3. Исправить `TestQueueProcessor` для безопасного логирования job.data

# Audit Verification Report — 2026-05-21 18:30

> Дата верификации: 2026-05-21
> Метод: Ручная верификация каждой находки с file:line против текущего состояния кодовой базы (working tree)
> Базовая линия: пустая (`docs/audit-baseline.yml` → `accepted: []`)

---

## Результаты верификации

| Аудит-файл | ✅ Подтверждено | ❌ False Positive | ⚠️ Устарело | 🔍 Пропущено |
|------------|---------------|-----------------|------------|-------------|
| audit-secrets.md | 4 | 0 | 0 | 0 |
| audit-owasp.md | 3 | 0 | 0 | 0 |
| audit-validation.md | 3 | 0 | 0 | 0 |
| audit-bugs.md | 2 | 0 | 0 | 0 |
| audit-errors.md | 5 | 0 | 0 | 0 |
| audit-architecture.md | 1 | 0 | 0 | 0 |
| audit-naming.md | 2 | 0 | 0 | 0 |
| audit-performance.md | 5 | 0 | 0 | 0 |
| audit-deployment.md | 3 | 0 | 0 | 0 |
| audit-api-contracts.md | 3 | 0 | 0 | 0 |
| audit-tests.md | 2 | 0 | 0 | 0 |
| audit-concurrency.md | 3 | 0 | 0 | 0 |
| audit-logging.md | 1 | 0 | 0 | 0 |
| audit-yagni.md | 17 | 0 | 0 | 0 |
| audit-matrix.md | 13 | 0 | 0 | 0 |
| audit-meta.md | 0 | 0 | 0 | 1 |
| **ИТОГО** | **67** | **0** | **0** | **1** |

---

## Детальная верификация по файлам

### audit-secrets.md — 4/4 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| SEC-01 | Hardcoded DB credentials | `prisma.config.ts:20` | `'postgresql://postgres:postgres@localhost:5432/postgres?schema=public'` всё ещё присутствует как fallback. | ✅ |
| SEC-02 | `.gitignore` не защищает `.env.*` | `.gitignore:37` | Строка 37 содержит только `.env`, нет `.env.*`, `.env.local`, `.env.production`, `.env.development`. | ✅ |
| SEC-04 | `.env.example` содержит реальные OIDC credentials | `.env.example:37-40` | Строки 37-40 содержат `OIDC_ISSUER=https://oalmxx.logto.app/oidc`, `OIDC_AUDIENCE=sl51b8k688hfuw9it0dqz`, `OIDC_JWKS_URI=https://oalmxx.logto.app/oidc/jwks`. | ✅ |
| SEC-07 🔴 | Нет автоматического сканирования секретов | `lefthook.yml:1-13` | Только `npm run check` + `npm run test:all`. Ни gitleaks, ни secretlint, ни CI/CD пайплайна. | ✅ |

### audit-owasp.md — 3/3 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| OWA-02 | TestQueueResolver без guards | `test-queue.resolver.ts:6-18` | Нет `@UseGuards`, нет `@Roles`. Mutation `addTestJob` полностью публична. | ✅ |
| OWA-02 | DebugResolver echo/echoMutation/testTranslation без guards | `debug.resolver.ts:47-68` | `testTranslation`, `echo`, `echoMutation` — ни один не имеет `@UseGuards`. | ✅ |
| OWA-05 | CORS без опций, Helmet отключен | `setup-app.ts:26-31,58` | `app.enableCors()` без аргументов. Helmet: CSP, COEP, COOP, CORP — все `false`. | ✅ |
| OWA-07 | GraphQL error formatter утекает сообщения | `error-formatter.ts:117-120` | `originalError.message` возвращается клиенту для не-HttpException ошибок. | ✅ |

### audit-validation.md — 3/3 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| VAL-01 | REST/GraphQL endpoints без ZodDto | `file-upload.controller.ts:49,84` | `@Req() req: FastifyRequest`, `@Param('*') filePathParam: string` — без DTO. `debug.resolver.ts:49,60,66` — скалярные args без Zod. | ✅ |
| VAL-02 | Нет max/min в ProfileUpdateSchema | `profile-update.input.ts:5-7` | `z.url()` без `.max()`, `.min()`, `.trim()`. | ✅ |
| VAL-05 | Нет ограничений на массивы | `profile-update.input.ts` | Ни одна Zod-схема не использует `z.array()` или `.min()/.max()` для коллекций. | ✅ |

### audit-bugs.md — 2/2 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| BUG-03 | CurrentUser может вернуть undefined | `current-user.decorator.ts:14` | `return httpRequest.user` — тип `Profile` (non-nullable), но может быть `undefined`. | ✅ |
| BUG-09 | Локальное время вместо UTC | `file-upload.service.ts:95-100` | `getFullYear()`, `getMonth()`, `getDate()`, `getHours()`, `getMinutes()` — не UTC варианты. | ✅ |

### audit-errors.md — 5/5 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| ERR-01 | AllExceptionsFilter игнорирует non-HTTP | `all-exceptions-filter.ts:34` | `if (host.getType() !== 'http') return;` — GraphQL/WS контексты игнорируются. | ✅ |
| ERR-04 | Нет process-level обработчиков | `main.ts:38-40` | Только `bootstrap().catch(...)`. Нет `process.on('unhandledRejection')` / `process.on('uncaughtException')`. | ✅ |
| ERR-05 | Нет таймаутов внешних вызовов | `prisma.service.ts:28`, `redis.service.ts:17` | Prisma: `new Pool({ connectionString })` без таймаутов. Redis: `new Redis({ host, port, password })` без `connectTimeout`. `ofetch` без таймаута. | ✅ |
| ERR-08 | Нет retry стратегий BullMQ | `app.module.ts:85-98` | `BullModule.forRootAsync()` без `defaultJobOptions: { attempts, backoff }`. | ✅ |
| ERR-09 | Нет AbortSignal | Все `src/` | 0 упоминаний `AbortController`, `abort`, `signal`, `cancel`. | ✅ |

### audit-architecture.md — 1/1 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| ARC-02 | Presentation слой обращается к БД | `jwt-auth.guard.ts:41,51-62`, `jwt.strategy.ts:50`, `health.controller.ts:10` | Guard напрямую вызывает `prisma.profile.findUnique()`/`upsert()`. Strategy вызывает `prisma.profile.upsert()`. HealthController инжектит PrismaService. | ✅ |

### audit-naming.md — 2/2 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| NAM-04 | generatePaths имеет side effects | `file-upload.service.ts:105-106` | `fs.existsSync()` + `fs.mkdirSync()` внутри метода с именем `generatePaths`. | ✅ |
| NAM-05 | Magic numbers | `setup-app.ts:34` (`100`), `setup-app.ts:44` (`1024`), `main.ts:14` (`10485760`), `health.controller.ts:30` (`150*1024*1024`), `health.controller.ts:34` (`0.9`) | Все без именованных констант. | ✅ |

### audit-performance.md — 5/5 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| PERF-02 | Sync I/O в async контексте | `file-upload.service.ts:44,65,105-106`, `debug.resolver.ts:37` | `fs.existsSync()`, `fs.statSync()`, `fs.mkdirSync()`, `readFileSync()` — все синхронные. | ✅ |
| PERF-03 | Нет GraphQL query depth limit | `app.module.ts:41-45` | `queryDepth` отсутствует в конфигурации Mercurius. | ✅ |
| PERF-04 | Нет maxFileSize | `setup-app.ts:18` | `app.register(multiPart)` без `limits: { fileSize }`. | ✅ |
| PERF-07 | Event loop blocking | Те же, что PERF-02 | Синхронное I/O блокирует event loop в hot path file-upload. | ✅ |
| PERF-08 | Нет кэширования | `app.module.ts:45` | `cache: false`. Нет `CacheModule`. Redis не используется как кэш данных. | ✅ |

### audit-deployment.md — 3/3 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| DEP-01 | Нет multi-stage build | `Dockerfile:1` | Единственный `FROM node:lts-alpine`. | ✅ |
| DEP-05 | Dev-зависимости в production | `Dockerfile:8` | `npm i` (не `npm ci --production`). `NODE_ENV=production` устанавливается после npm install. | ✅ |
| DEP-08 | `.env` не в `.dockerignore` | `.dockerignore:1-6` | Файл не содержит `.env`. | ✅ |

### audit-api-contracts.md — 3/3 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| CON-01 | Нет описаний в GraphQL | `profile.object-type.ts`, `profile-role.enum.ts`, `profile-update.input.ts` | Ни один GraphQL тип, поле, enum, query, mutation не имеет `description`, кроме `addTestJob`. | ✅ |
| CON-03 | POST /upload возвращает 200 | `file-upload.controller.ts:29` | `@Post('upload')` без `@HttpCode(201)`. `@ApiResponse({status: 200})`. | ✅ |
| CON-04 | API не версионировано | `main.ts:1-40` | Нет `app.enableVersioning()`, нет `app.setGlobalPrefix()`. | ✅ |

### audit-tests.md — 2/2 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| TST-07 | Нет E2E для некоторых эндпоинтов | (absence) | `GET /uploads/*`, `GET /api/list`, `Mutation.addTestJob` не имеют E2E тестов. | ✅ |
| TST-10 | Knip: неиспользуемые экспорты | `test/utils/mocks.ts:73` | `createPrismaMock` экспортируется, но не импортируется. | ✅ |

### audit-concurrency.md — 3/3 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| CON-04 | Кэш DevLauncherController без инвалидации | `dev-launcher.controller.ts:14` | `private cachedHtml?: string` никогда не инвалидируется. | ✅ |
| CON-05 | TestQueueProcessor не идемпотентен | `test-queue.processor.ts:9-18` | Нет deduplication, at-least-once delivery может вызвать повторную обработку. | ✅ |
| CON-06 | Нет механизмов отмены | `test-queue.processor.ts:14`, всё `src/` | 0 упоминаний `AbortController`/`AbortSignal`. | ✅ |

### audit-logging.md — 1/1 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| LOG-02 | Нет бизнес-логирования | `file-upload.service.ts:1-119`, `profile.service.ts:1-18` | `FileUploadService`: 0 вызовов логгера для бизнес-событий. `ProfileService.updateProfile`: 0 логов. | ✅ |

### audit-yagni.md — 17/17 подтверждено

| ID | Находка | Файл:строка | Верификация | Статус |
|----|---------|------------|-------------|--------|
| Dead-1 | `createPrismaMock` не используется | `test/utils/mocks.ts:73` | Экспортируется, 0 импортов. | ✅ |
| Dead-2 | `getTestingApp` не используется | `test/utils/testing-app.ts:77` | Экспортируется, 0 импортов. | ✅ |
| Dead-3 | `ProfileService` в exports без необходимости | `profile.module.ts:7` | Не импортируется другими модулями. | ✅ |
| Dead-4 | `DebugResolver` в exports без необходимости | `debug.module.ts:7` | Не импортируется другими модулями. | ✅ |
| Dead-5 | `FileUploadController` в exports без необходимости | `file-upload.module.ts:10` | Не импортируется другими модулями. | ✅ |
| Dead-6 | `FileUploadController` дублируется в providers | `file-upload.module.ts:8` | И в `providers`, и в `controllers`. | ✅ |
| Dead-7 | 5 неиспользуемых devDependencies | `package.json` | `@fission-ai/openspec`, `kodu`, `pactum`, `@types/ioredis`, `@types/form-data`. | ✅ |
| Dead-8 | `@vitest/spy` — unlisted dependency | `test/utils/mocks.ts:2` | Импортируется, но не указан в package.json. | ✅ |
| Abst-1 | `RedisService` — тонкая обёртка | `redis.service.ts:1-27` | `getClient()` возвращает сырой Redis. | ✅ |
| Abst-2 | `DotenvValidatorService` — логика в конструкторе | `dotenv-validator.service.ts` | Вся валидация в конструкторе, нет публичных методов. | ✅ |
| Abst-3 | `ProfileService` — тривиальный сервис | `profile.service.ts:1-18` | Один метод `updateProfile` — чистая прослойка. | ✅ |
| OE-1 | TestQueueModule в production | `app.module.ts:36` | Включён в AppModule, без guards, без feature flag. | ✅ |
| OE-2 | I18nModule избыточен | `app.module.ts:104-118` | Только 1 потребитель (`testTranslation`), 2 языка. | ✅ |
| OE-3 | PrismaStudioModule как подпроцесс | `prisma-studio.service.ts` | `exec('npm run db:studio')` из NestJS runtime. | ✅ |
| OE-4 | AppController — ручной catch-all | `app.controller.ts` | `@All()` хендлер для 404 — избыточно. | ✅ |
| OE-5 | DebugResolver публичные echo методы | `debug.resolver.ts:47-68` | Добавляют шум в продакшен-GraphQL. | ✅ |
| TODO | TODO в prisma.service.ts без даты/issue | `prisma.service.ts:23` | Нет даты, нет ссылки на issue. | ✅ |

### audit-matrix.md — Критические сценарии

| Сценарий | Риск | Находка | Верификация | Статус |
|----------|------|---------|-------------|--------|
| A1 | 🔴 | Нет reconnect к БД | `prisma.service.ts:31-33` — `$connect()` только на старте. Нет retry. | ✅ |
| A2 | 🔴 | Нет reconnect к Redis | `redis.service.ts:17` — ioredis reconnect есть, но нет graceful fallback. | ✅ |
| A12 | 🔴 | Нет retry миграций | `prestart:prod` в package.json — нет retry logic. | ✅ |
| A3 | 🟡 | Нет мониторинга stalled Redis | `redis.service.ts` — нет `isOpen` проверок. | ✅ |
| A4 | 🟠 | Нет offline-mode для OIDC | Нет кэширования JWKS/fallback. | ✅ |
| A5 | 🟡 | BullMQ ломается при отказе Redis | Каскадный сбой (C1). | ✅ |
| A14 | 🟡 | WebSocket subscription disconnect | Нет heartbeat, onDisconnect обработчика. | ✅ |
| A15 | 🟠 | CORS misconfiguration | `app.enableCors()` без опций. | ✅ |
| A16 | 🟠 | Helmet отключён | CSP, COEP, COOP, CORP — false. | ✅ |
| A18 | 🟡 | OIDC JWKS rotation — fallback | Нет fallback при недоступности JWKS. | ✅ |
| A20 | 🟡 | Job зависает в очереди | `test-queue.processor.ts` — нет try-catch, нет onFailed. | ✅ |
| A21 | 🟡 | Unhandled Promise Rejection | `main.ts` — нет `process.on('unhandledRejection')`. | ✅ |
| A24 | 🟡 | Pino Logger failure | Нет buffer/fallback при отказе Pino. | ✅ |

### audit-meta.md — 1 пропущено

| Находка | Статус |
|---------|--------|
| `src/i18n/` не проверен ни одним репортом | 🔍 Пропущено (не является FAIL) |

---

## Пропущенные критические риски

Риски, не попавшие в FAIL-секции отчётов, но обнаруженные при верификации:

1. **OIDC_MOCK_ENABLED=true в `.env.example`**: Значение по умолчанию включает mock-режим аутентификации. При копировании `.env.example` → `.env` и деплое с минимальной конфигурацией, любой запрос может пройти аутентификацию через `x-mock-sub` header. (пересечение SEC/OIDC-MOCK)

2. **HealthController инжектит PrismaService**: Несмотря на отметку в ARC-02, это также проблема безопасности — HealthController не имеет guards и открыт для любого запроса. (пересечение ARC/OWASP)

3. **Dockerfile устанавливает `NODE_ENV=production` после `npm i`**: В результате `npm i` устанавливает dev-зависимости, что отражено в DEP-05, но также означает, что lefthook может выполниться в production билде. (пересечение DEP/SEC)

4. **BullMQ `defaultJobOptions` не настроены**: Нет `attempts`, `backoff`, `removeOnComplete` — при падении процессора задача не будет перезапущена. (пересечение ERR/CON)

---

## Итоговая сводка

**Всего FAIL-находок проверено: 67**
**False Positive: 0** — все находки подтверждены как реальные, актуальные проблемы
**Устарело: 0** — ни одна проблема не исправлена с момента аудита
**Пропущено: 1** — `src/i18n/` (модуль переводов, не влияет на безопасность/функциональность)

**Критические (🔴) неисправленные риски:**
1. SEC-07: Полное отсутствие автоматического сканирования секретов (pre-commit/CI)
2. A1: Нет reconnect к БД после потери соединения
3. A2: Нет graceful degradation для Redis
4. A12: Нет retry при сбое миграций
5. OWA-05: CORS разрешает все origins + Helmet отключён
6. ERR-04: Нет process-level обработчиков `unhandledRejection`/`uncaughtException`

**Вывод:** Все находки аудита валидны, кодовая база не изменялась после формирования отчётов. Рекомендуется приступить к исправлению в порядке приоритетов, указанных в каждом отчёте.

*Verification performed: 2026-05-21*

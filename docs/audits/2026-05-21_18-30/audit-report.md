# Full Audit Report — 2026-05-21 18:30

## Компоненты системы

1. **Аутентификация (Auth)** — JWT guards, стратегии, RBAC (`src/common/auth/`)
2. **GraphQL API** — резолверы, скаляры, форматтер ошибок (`src/common/graphql/`)
3. **REST API** — корневой контроллер (`src/app.controller.ts`)
4. **База данных (Prisma)** — схемы, сервис, миграции (`prisma/`, `src/common/prisma/`)
5. **Файлы (File Upload)** — загрузка/управление файлами (`src/modules/file-upload/`)
6. **Профили (Profile)** — управление профилями (`src/modules/profile/`)
7. **Обработка ошибок** — AllExceptionsFilter (`src/common/all-exceptions-filter.ts`)
8. **Логирование (Pino)** — конфиг, GQL interceptor (`src/common/logger/`)
9. **Redis** — кеш/брокер (`src/common/redis/`)
10. **Health Check** — эндпоинты здоровья (`src/infrastructure/health/`)
11. **Bull Queue** — фоновая очередь (`src/infrastructure/test-queue/`)
12. **i18n** — локализация (`src/i18n/`)
13. **Bootstrap** — настройка приложения (`src/bootstrap/`)
14. **Dev Tools** — Bull Board, Debug, Prisma Studio, Logger Serve (`src/dev-tools/`)
15. **Dotenv Validation** — валидация env (`src/common/dotenv-validator/`)
16. **DB Backup** — бэкап базы (`src/db-backup-tool/`)

---

## Компонент: Аутентификация (Auth)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| ARC-02 | Presentation слой не обращается к БД напрямую | ❌ FAIL 🟠 | `jwt-auth.guard.ts:41-51` — `prisma.profile.findUnique()` и `upsert()` в guard | **1. Вынести DB-запросы в AuthService** \\ 2. Создать ProfileService метод \\ 3. Использовать DI для делегирования | Нет |
| ARC-02 | JwtStrategy тоже обращается к БД | ❌ FAIL 🟠 | `jwt.strategy.ts:50` — `prisma.profile.upsert()` | **1. Вынести в сервис** \\ 2. Кэшировать профиль в Redis \\ 3. Использовать guard-level сервис | Нет |
| OWA-02 | TestQueueResolver без auth guards | ❌ FAIL 🟠 | `test-queue.resolver.ts:10-18` — `addTestJob` без `@UseGuards` | **1. Добавить `@UseGuards(JwtAuthGuard)`** \\ 2. Добавить проверку ролей \\ 3. Настроить resolver-level middleware | Нет |
| OWA-02 | DebugResolver без auth guards | ❌ FAIL 🟠 | `debug.resolver.ts` — `echo`, `testTranslation`, `echoMutation` без guards | **1. Добавить `@UseGuards(JwtAuthGuard)`** \\ 2. Ограничить dev-режимом \\ 3. Вынести в dev-only модуль | Нет |
| BUG-03 | CurrentUser возвращает undefined | ❌ FAIL 🟡 | `current-user.decorator.ts:14` — возвращает `Profile` (non-null) но может быть undefined | **1. Добавить `throw new UnauthorizedException()`** \\ 2. Изменить тип на `Profile \| undefined` \\ 3. Использовать default-значение | Нет |

---

## Компонент: GraphQL API

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| CON-01 | GraphQL типы без описаний | ❌ FAIL 🟠 | 13 из 14 элементов без `description`: Profile, ProfileUpdateInput, enums, резолверы | **1. Добавить `description` в декораторы** \\ 2. Добавить JSDoc \\ 3. Сгенерировать SDL-документацию | Нет |
| OWA-07 | Утечка внутренних сообщений в GQL ошибках | ❌ FAIL 🟠 | `error-formatter.ts:117-120` — `originalError.message` для необработанных ошибок | **1. Заменить на `'Internal Server Error'`** \\ 2. Логировать оригинал в Pino \\ 3. Использовать machine-readable code | Нет |
| PERF-03 | Нет ограничения глубины GraphQL запросов | ❌ FAIL 🟠 | `app.module.ts:37-73` — нет `queryDepth`, `validationRules` | **1. Добавить `queryDepth: 8`** \\ 2. Использовать `graphql-query-complexity` \\ 3. Настроить cost-анализ | Нет |
| PERF-08 | GraphQL кэш отключён | ❌ FAIL 🟠 | `app.module.ts:45` — `cache: false` | **1. Включить `cache: true`** \\ 2. Использовать Redis cache store \\ 3. Настроить per-query кэширование | Нет |

---

## Компонент: REST API

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| CON-03 | POST /upload возвращает 200 вместо 201 | ❌ FAIL 🟠 | `file-upload.controller.ts` — нет `@HttpCode(HttpStatus.CREATED)` | **1. Добавить `@HttpCode(201)`** \\ 2. Вернуть Location header \\ 3. Добавить тело ответа с id | Нет |
| CON-04 | Нет версионирования API | ❌ FAIL 🟠 | `main.ts` — нет `enableVersioning()`, нет `setGlobalPrefix()` | **1. Включить `enableVersioning()`** \\ 2. Добавить `/v1/` префикс \\ 3. Версионировать GraphQL через namespace | Нет |
| VAL-01 | REST эндпоинты без schema-валидации | ❌ FAIL 🟠 | `POST /upload`, `GET /uploads/*`, `GET /` — без ZodDto | **1. Добавить Zod-схемы для всех эндпоинтов** \\ 2. Использовать глобальный ValidationPipe \\ 3. Добавить ручную валидацию | Нет |

---

## Компонент: База данных (Prisma)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| SEC-01 | Hardcoded DB credentials | ❌ FAIL 🟠 | `prisma.config.ts:20` — `postgresql://postgres:postgres@localhost:5432/postgres?schema=public` | **1. Заменить на `env('DATABASE_URL') ?? undefined`** \\ 2. Добавить fallback-error message \\ 3. Удалить файл из репозитория | Нет |
| ERR-05 | Prisma без connectionTimeout | ❌ FAIL 🟠 | `prisma.service.ts:22` — `new Pool({ connectionString })` без таймаутов | **1. Добавить `connectionTimeoutMillis: 10000`** \\ 2. Добавить `idleTimeoutMillis: 30000` \\ 3. Настроить pool `max: 10` явно | Нет |
| Matrix A1 | Нет reconnect при недоступности БД | ❌ FAIL 🔴 | `prisma.service.ts` — нет retry-логики при `$connect()` | **1. Добавить exponential backoff retry** \\ 2. Graceful fallback с кэшем \\ 3. Healthcheck прерывает retry | Нет |
| Matrix A12 | Нет retry миграций при старте | ❌ FAIL 🔴 | `package.json` — `prestart:prod` запускает `db:migrations:apply` без retry | **1. Обернуть в retry с backoff** \\ 2. Добавить timeout на миграцию \\ 3. Graceful failure — не блокировать app | Нет |
| PERF-06 | Пул соединений не сконфигурирован явно | ❌ FAIL 🟡 | `prisma.service.ts:22` — `Pool` без `max`/`min`/`idleTimeoutMillis` | **1. Добавить конфигурацию пула** \\ 2. Мониторить через healthcheck \\ 3. Добавить Prometheus метрики | Нет |

---

## Компонент: File Upload

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| VAL-08 | MIME тип не верифицируется по содержимому | ❌ FAIL 🟠 | `file-upload.service.ts` — проверка только `part.mimetype` (заголовок) | **1. Использовать `file-type` для проверки содержимого** \\ 2. Белый список MIME-типов \\ 3. Отклонять неизвестные типы | Нет |
| VAL-08 | Нет лимита размера файла | ❌ FAIL 🟠 | `setu-app.ts:18` — `multiPart` без `limits.fileSize` | **1. Добавить `limits: { fileSize: 5MB }`** \\ 2. Проверять `part.file.truncated` \\ 3. Отклонять oversized файлы | Нет |
| PERF-02 | Sync I/O в hot path загрузки | ❌ FAIL 🟠 | `file-upload.service.ts:44,65,105-106` — `existsSync`, `statSync`, `mkdirSync` | **1. Заменить на `fs.promises` API** \\ 2. Использовать асинхронные вызовы \\ 3. Убрать лишний `existsSync` перед mkdirSync | Нет |
| BUG-09 | Локальное время вместо UTC | ❌ FAIL 🟠 | `file-upload.service.ts:95-100` — `getHours()`, `getDate()` вместо UTC | **1. Заменить на `getUTCHours()`, `getUTCDate()`** \\ 2. Использовать `date-fns` UTC-функции \\ 3. Хранить все даты в ISO 8601 | Нет |
| LOG-02 | FileUpload без аудит-логов | ❌ FAIL 🟠 | `file-upload.service.ts` — 0 вызовов логгера | **1. Инжектить PinoLogger** \\ 2. Логировать каждый upload: userId, filename, size \\ 3. Добавить audit-событие | Нет |

---

## Компонент: Profile

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| VAL-02 | ProfileUpdateSchema без maxLength | ❌ FAIL 🟠 | `profile-update.input.ts` — `avatarUrl` только `z.url()` без `.max()` | **1. Добавить `.max(2048).trim()`** \\ 2. Добавить `.max()` для всех строк \\ 3. Использовать константы для лимитов | Нет |
| LOG-02 | ProfileService без аудит-логов | ❌ FAIL 🟠 | `profile.service.ts` — 0 вызовов логгера | **1. Инжектить PinoLogger** \\ 2. Логировать updateProfile: userId, changedFields \\ 3. Добавить subscription-log | Нет |
| PERF-08 | Profile upsert при каждом JWT-запросе | ❌ FAIL 🟠 | `jwt.strategy.ts:50` — upsert профиля на каждый запрос | **1. Кэшировать в Redis с TTL** \\ 2. Использовать memoization \\ 3. Добавить batch-обновления | Нет |

---

## Компонент: Обработка ошибок

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| ERR-01 | AllExceptionsFilter игнорирует graphql/ws контексты | ❌ FAIL 🟠 | `all-exceptions-filter.ts` — `if (host.getType() !== 'http') return;` | **1. Добавить обработку graphql контекста** \\ 2. Пробрасывать в gqlErrorFormatter \\ 3. Логировать все контексты | Нет |
| ERR-04 | Нет process-level обработчиков ошибок | ❌ FAIL 🔴 | `main.ts` — нет `process.on('unhandledRejection')` и `process.on('uncaughtException')` | **1. Добавить глобальные обработчики** \\ 2. Логировать и корректно завершать процесс \\ 3. Добавить sentry/similar | Нет |
| ERR-05 | Внешние вызовы без таймаутов | ❌ FAIL 🟠 | `redis.service.ts`, `prisma.service.ts`, `ofetch` — нет явных таймаутов | **1. Добавить connectTimeout для Redis** \\ 2. Добавить connectionTimeout для Prisma \\ 3. Добавить timeout для HTTP-вызовов | Нет |
| ERR-08 | BullMQ без retry-стратегии | ❌ FAIL 🟠 | `app.module.ts` — `forRootAsync` без `defaultJobOptions` | **1. Добавить `attempts: 3, backoff: { type: 'exponential', delay: 1000 }`** \\ 2. Добавить jitter \\ 3. Настроить per-queue options | Нет |
| ERR-09 | Нет AbortSignal/AbortController | ❌ FAIL 🟠 | Везде — 0 использований AbortController | **1. Внедрить AbortController в долгие операции** \\ 2. Использовать AbortSignal в fetch \\ 3. Добавить CancellationToken паттерн | Нет |

---

## Компонент: Redis

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| Matrix A2 | Нет reconnect при падении Redis | ❌ FAIL 🔴 | `redis.service.ts` — `new Redis(...)` без `retryStrategy` | **1. Добавить `retryStrategy` с backoff** \\ 2. Настроить `lazyConnect: true` \\ 3. Graceful degradation | Нет |
| ERR-05 | Redis без connectTimeout | ❌ FAIL 🟠 | `redis.service.ts:17` — нет `connectTimeout`, `maxRetriesPerRequest` | **1. Добавить `connectTimeout: 10000`** \\ 2. Настроить `maxRetriesPerRequest: null` \\ 3. Добавить `lazyConnect` | Нет |
| PERF-06 | Redis без retryStrategy | ❌ FAIL 🟡 | `redis.service.ts` — ioredis defaults, нет экспоненциальной задержки | **1. Добавить `retryStrategy(times) => Math.min(times * 50, 2000)`** \\ 2. Настроить `enableReadyCheck` \\ 3. Подключаться в `onModuleInit` | Нет |

---

## Компонент: Конфигурация и Deployment

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| DEP-01 | Нет multi-stage build | ❌ FAIL 🟠 | `Dockerfile` — один stage | **1. Разделить на build и production stage** \\ 2. Использовать `npm ci --production` \\ 3. Минимизировать образ | Нет |
| DEP-05 | Dev-зависимости в production образе | ❌ FAIL 🟠 | `Dockerfile` — `npm i` (не `npm ci --production`) | **1. Multi-stage + `npm ci --production`** \\ 2. Не копировать node_modules из build stage \\ 3. Удалить dev-инструменты | Нет |
| DEP-08 | .env не в .dockerignore | ❌ FAIL 🟠 | `.dockerignore` — `.env` отсутствует | **1. Добавить `.env` и `.env.*`** \\ 2. Использовать docker secrets \\ 3. Удалить .env из build context | Нет |
| OWA-05 | CORS открыт всем origins | ❌ FAIL 🟠 | `setup-app.ts` — `app.enableCors()` без опций | **1. Добавить explicit origin whitelist** \\ 2. Использовать env-конфигурацию \\ 3. Добавить dynamic CORS | Нет |
| OWA-05 | Helmet политики отключены | ❌ FAIL 🟠 | `setup-app.ts` — `contentSecurityPolicy: false`, `crossOriginEmbedderPolicy: false` | **1. Включить CSP с разумными политиками** \\ 2. Включить crossOrigin политики \\ 3. Добавить HSTS | Нет |

---

## Компонент: Безопасность (Secrets & Scanning)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| SEC-07 | Нет автоматического сканирования секретов | ❌ FAIL 🔴 | `lefthook.yml` — нет gitleaks/trufflehog | **1. Добавить gitleaks в pre-commit** \\ 2. Добавить GitHub Secret Scanning \\ 3. Настроить detect-secrets в CI | Нет |
| SEC-04 | .env.example с реальными credentials | ❌ FAIL 🟡 | `.env.example` — `oalmxx.logto.app`, `sl51b8k688hfuw9it0dqz` | **1. Заменить на placeholder'ы** \\ 2. Добавить комментарии с форматом \\ 3. Удалить реальные значения из истории | Нет |
| SEC-02 | .gitignore не защищает .env.* | ❌ FAIL 🟡 | `.gitignore` — только `.env`, не `.env.local`/`.env.production` | **1. Добавить `.env.*`** \\ 2. Добавить `*.key`, `*.pem` \\ 3. Проверить git history | Нет |
| OWA-06 | Rate limiting глобальный 100/мин | ❌ FAIL 🟡 | `setup-app.ts` — rate-limit на весь сервер, не специфичен для auth | **1. Добавить отдельный rate-limit на auth routes** \\ 2. Настроить login-specific лимит (5/мин) \\ 3. Использовать Redis-based rate-limit | Нет |

---

## Компонент: Тесты и качество кода

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| TST-07 | Не хватает E2E тестов | ❌ FAIL 🟠 | 5 эндпоинтов без e2e: `GET /uploads/*`, `GET /api/list`, `GET /file/*`, `addTestJob`, `testTranslation` | **1. Добавить E2E тесты** \\ 2. Использовать E2EClient + createTestingApp \\ 3. Покрыть ошибки и граничные случаи | Нет |
| TST-10 | Неиспользуемые экспорты и зависимости | ❌ FAIL 🟠 | Knip: 4 неиспользуемых экспорта, 5 неиспользуемых devDependencies | **1. Удалить неиспользуемые экспорты** \\ 2. Удалить pactum, kodu и др. \\ 3. Исправить unresolved import | Нет |
| NAM-04 | Имена функций не соответствуют поведению | ❌ FAIL 🟠 | `generatePaths` создаёт папки, `getSafeFileInfo` читает ФС | **1. Переименовать `generatePaths` → `ensurePathsAndGenerate`** \\ 2. `getSafeFileInfo` → `resolveSafeFileInfo` \\ 3. Добавить JSDoc | Нет |
| NAM-05 | Magic numbers и строки | ❌ FAIL 🟠 | 11 magic values: rate limit 100, bodyLimit 10485760, jit: 1, '1 minute' и др. | **1. Создать именованные константы** \\ 2. Вынести в конфиг \\ 3. `jit: 1` → `jit: true` | Нет |
| YAGNI-02 | Dead code (8 находок) | ❌ FAIL 🟡 | `createPrismaMock`, `getTestingApp`, `ProfileService` в exports, `DebugResolver` в exports | **1. Удалить неиспользуемые экспорты** \\ 2. Убрать из exports лишние модули \\ 3. Оставить только используемое | Нет |

---

## Компонент: Dev Tools и Over-engineering

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| CON-04 | DevLauncher кэш без инвалидации | ❌ FAIL 🟡 | `dev-launcher.controller.ts:14` — `cachedHtml` никогда не обновляется | **1. Добавить TTL 5 минут** \\ 2. Убрать кэш (dev tool) \\ 3. Использовать conditional requests | Нет |
| YAGNI-05 | TODO без даты | ❌ FAIL 🟡 | `prisma.service.ts` — TODO без owner/issue | **1. Добавить issue # и дату** \\ 2. Исправить или удалить \\ 3. Создать tech debt item | Нет |
| YAGNI-03 | RedisService — тонкая обёртка | ❌ FAIL 🟡 | `redis.service.ts` — `getClient()` без сокрытия деталей | **1. Добавить бизнес-методы** \\ 2. Удалить и использовать ioredis напрямую \\ 3. Оставить, добавив абстракцию | Нет |
| YAGNI-03 | DotenvValidatorService — немой сервис | ❌ FAIL 🟡 | Пропускает production, только non-prod | **1. Расширить на production** \\ 2. Удалить сервис, перенести логику \\ 3. Использовать ConfigModule validation | Нет |

---

## Компонент: Фоновые задачи (BullMQ)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| CON-05 | TestQueueProcessor не идемпотентен | ❌ FAIL 🟡 | `test-queue.processor.ts` — нет dedup, at-least-once доставка | **1. Добавить dedup key** \\ 2. Проверять состояние в БД \\ 3. Использовать job.id для идемпотентности | Нет |
| CON-06 | TestQueueProcessor без механизма отмены | ❌ FAIL 🟡 | `test-queue.processor.ts:14` — `setTimeout` без AbortSignal | **1. Проверять `job.isCancelled()`** \\ 2. Добавить AbortController \\ 3. Настроить timeout на job | Нет |
| ERR-08 | BullMQ без retry | ❌ FAIL 🟠 | `app.module.ts` — `bullBoard.forRoot()` без `defaultJobOptions` | **1. Добавить `defaultJobOptions` с retry** \\ 2. Настроить per-queue options \\ 3. Включить exponential backoff | Нет |

---

## Компонент: i18n (непокрытый модуль)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| — | Модуль не был проверен ни одним аудитом | ⚠️ Пропущен | `src/i18n/` — 2 языка (ru/en), 1 строка перевода, 1 потребитель | **1. Включить в план будущих аудитов** \\ 2. Проверить полноту ключей \\ 3. Проверить placeholder-дыры | — |

---

## Сводка

| Компонент | ❌ FAIL 🔴 | ❌ FAIL 🟠 | ❌ FAIL 🟡 | ❌ FAIL 🟢 | ⏸ ACCEPTED | Итого FAIL |
|-----------|-----------|-----------|------------|-----------|-----------|------------|
| Аутентификация (Auth) | 0 | 4 | 1 | 0 | 0 | 5 |
| GraphQL API | 0 | 4 | 0 | 0 | 0 | 4 |
| REST API | 0 | 3 | 0 | 0 | 0 | 3 |
| База данных (Prisma) | 2 | 2 | 1 | 0 | 0 | 5 |
| File Upload | 0 | 4 | 0 | 0 | 0 | 4 |
| Profile | 0 | 3 | 0 | 0 | 0 | 3 |
| Обработка ошибок | 1 | 4 | 0 | 0 | 0 | 5 |
| Redis | 1 | 1 | 1 | 0 | 0 | 3 |
| Конфигурация и Deployment | 0 | 6 | 0 | 0 | 0 | 6 |
| Безопасность (Secrets) | 1 | 0 | 3 | 0 | 0 | 4 |
| Тесты и качество кода | 0 | 4 | 1 | 0 | 0 | 5 |
| Dev Tools и Over-engineering | 0 | 0 | 4 | 0 | 0 | 4 |
| Фоновые задачи (BullMQ) | 0 | 1 | 2 | 0 | 0 | 3 |
| i18n (непокрыт) | — | — | — | — | — | — |
| **ИТОГО** | **5** | **36** | **13** | **0** | **0** | **54** |

> Примечание: Итоговое число 54, т.к. matrix сценарии (13 шт) не включены в эту таблицу (сводка по компонентам). Вместе с ними — 67 подтверждённых находок.

---

## Критические риски (❌ FAIL 🔴)

### 🔴 SEC-07 — Безопасность (Secrets)
**Файл:** `lefthook.yml`
**Проверка:** Автоматическое сканирование секретов
**Доказательство:** В `lefthook.yml` только `npm run check` и `npm run test:all`. Нет gitleaks/trufflehog/detect-secrets ни в pre-commit, ни в CI.
**Риск:** Любой commit с паролем/токеном навсегда остаётся в git history. Обнаружение — только когда утечка уже произошла.
**Решение:** 
1. Добавить gitleaks в pre-commit hook
2. Настроить GitHub Secret Scanning
3. Запустить detect-secrets history scan

---

### 🔴 ERR-04 — Обработка ошибок
**Файл:** `main.ts`
**Проверка:** Unhandled rejections / uncaught exceptions
**Доказательство:** Нет `process.on('unhandledRejection')` и `process.on('uncaughtException')` — процесс молча упадёт при любой необработанной асинхронной ошибке.
**Риск:** Один unhandled promise rejection — и весь процесс завершается. В production это = даунтайм.
**Решение:**
1. Добавить глобальные обработчики в main.ts с логгированием
2. Корректно завершать процесс (process.exit(1) после логирования)
3. Добавить sentry для алертинга

---

### 🔴 Matrix A1 — База данных (Prisma)
**Файл:** `src/common/prisma/prisma.service.ts`
**Проверка:** Нет механизма reconnect при недоступности БД
**Доказательство:** `$connect()` вызывается один раз в `onModuleInit`. При потере соединения — PgPool не имеет встроенного reconnect с уведомлением приложения.
**Риск:** Падение БД → полный отказ сервиса без автоматического восстановления. Запросы зависают или падают с ошибкой.
**Решение:**
1. Добавить `PrismaClient` с `connectionLimit` и retry
2. Healthcheck должен проверять соединение
3. Graceful fallback при недоступности

---

### 🔴 Matrix A2 — Redis
**Файл:** `src/common/redis/redis.service.ts`
**Проверка:** Нет reconnect-стратегии
**Доказательство:** `new Redis(...)` без `retryStrategy`, `lazyConnect: false`. При падении Redis — ioredis сделает 3 попытки (default) и остановится.
**Риск:** Redis недоступен → BullMQ не работает, healthcheck падает, subscriptions не работают. Нет автоматического восстановления.
**Решение:**
1. Добавить `retryStrategy` с экспоненциальным backoff
2. Включить `lazyConnect: true`
3. Graceful degradation при отключении Redis

---

### 🔴 Matrix A12 — Миграции
**Файл:** `package.json` — `prestart:prod: npm run db:migrations:apply`
**Проверка:** Нет retry при сбое миграций
**Доказательство:** `db:migrations:apply` запускается без retry/logic в prestart скрипте. Если миграция падает — приложение не стартует.
**Риск:** Сбой миграции во время деплоя → app не запускается, production down. Ручное вмешательство требуется.
**Решение:**
1. Обернуть `prisma migrate deploy` в retry
2. Добавить timeout на выполнение миграции
3. Graceful failure — логировать и exit 1

---

## Структура сессии

```
docs/audits/2026-05-21_18-30/
├── audit-api-contracts.md    — Аудит API-контрактов
├── audit-architecture.md     — Аудит архитектуры
├── audit-bugs.md             — Аудит логических ошибок
├── audit-concurrency.md      — Аудит конкурентности
├── audit-deployment.md       — Аудит деплоя
├── audit-errors.md           — Аудит обработки ошибок
├── audit-logging.md          — Аудит логирования
├── audit-matrix.md           — Матрица взаимодействий
├── audit-meta.md             — Мета-контроль
├── audit-naming.md           — Аудит именования
├── audit-owasp.md            — Аудит OWASP безопасности
├── audit-performance.md      — Аудит производительности
├── audit-secrets.md          — Аудит утечки секретов
├── audit-tests.md            — Аудит тестов
├── audit-validation.md       — Аудит валидации
├── audit-yagni.md            — Аудит over-engineering
├── audit-verify.md           — Финальная верификация
└── audit-report.md           — Сводный отчёт (этот файл)
```

---

*Аудит выполнен: 2026-05-21 18:30*
*Всего проверок: 14 аудитов + verify + meta*
*Верифицировано находок: 67 (5 🔴, 36 🟠, 13 🟡, 0 🟢)*
*False positives: 0 | Пропущено модулей: 1 (i18n)*

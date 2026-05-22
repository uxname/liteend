# Полный отчёт аудита — 2026-05-22 11:43

## Компоненты системы

1. **Аутентификация** — `src/common/auth/`
2. **API (GraphQL)** — `src/common/graphql/`, resolvers, `src/app.module.ts`
3. **API (REST)** — контроллеры `FileUpload`, `Health`, `LoggerServe`, `DevLauncher`
4. **База данных** — `src/common/prisma/`, `prisma/schema.prisma`
5. **Файловый менеджмент** — `src/modules/file-upload/`
6. **Профили** — `src/modules/profile/`
7. **Фоновые задачи** — `src/infrastructure/test-queue/`
8. **Health Checks** — `src/infrastructure/health/`
9. **Dev Tools** — `src/dev-tools/`
10. **Логирование** — `src/common/logger/`
11. **Кеш/Redis** — `src/common/redis/`
12. **Инфраструктура** — Docker, compose, `.env`, `package.json`, конфиги

---

## Компонент: Аутентификация

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| OWA-06 / VAL-04 | OIDC_MOCK — полный обход аутентификации | ❌ FAIL 🔴 | `jwt-auth.guard.ts:30-51` — `x-mock-sub` header позволяет притвориться любым пользователем; `.env.example` включает `OIDC_MOCK_ENABLED=true` по умолчанию; нет проверки `NODE_ENV` | Добавить проверку `NODE_ENV === 'development'`, убрать mock из production-сборки | Нет |
| CON-01 | Cache stampede при кеш-миссе `findOrCreateProfile` | ❌ FAIL 🟠 | `auth.service.ts:14-18` — несколько concurrent запросов с одинаковым `oidcSub` одновременно бьют в БД при кеш-миссе | Использовать `SET NX` distributed lock при кеш-миссе | Нет |
| LOG-06 / LOG-08 | Нет аудит-логов критических операций (вход, создание профиля, ошибки JWT) | ❌ FAIL 🟠 | `AuthService` — нет логов при `findOrCreateProfile`, `findProfileBySub`; `JwtStrategy` — нет логов при ошибке валидации | Добавить `logger.log/warn` во все критические методы | Нет |
| ARC-07 / ARC-12 | Импорт Profile из модульного слоя; несоответствие типов Profile (Prisma vs GraphQL) | ❌ FAIL 🟡 | `jwt.strategy.ts:7` — импорт Profile из `@/modules/profile`; AuthService возвращает Prisma Profile, JwtStrategy ожидает GraphQL Profile | Вынести Profile type в `@/common/types` или использовать Prisma-тип | Нет |
| ERR-01 | Тихое проглатывание ошибок Redis (`.catch(() => {})`) | ❌ FAIL 🟡 | `auth.service.ts:28,47` — `.catch(() => {})` без логирования; ошибки Redis теряются, кеш silently stale | Заменить на `.catch(err => logger.warn(...))` | Нет |
| ERR-01 / VAL-03 | `JSON.parse(cached)` без try/catch | ❌ FAIL 🟡 | `auth.service.ts:16,36` — битый JSON в Redis вызывает SyntaxError → 500 | Обернуть в try/catch, при ошибке — удалить ключ и перезапросить из БД | Нет |
| ERR-08 | Retry без jitter в Redis | ❌ FAIL 🟡 | `auth.service.ts` (через `redis.service.ts:23-24`) — линейный backoff без jitter | Добавить рандомизацию: `delay * (0.5 + Math.random() * 0.5)` | Нет |

**ACCEPTED:** нет

---

## Компонент: API (GraphQL)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| VAL-01 / VAL-02 | GraphQL аргументы без Zod-схем и ограничений длины | ❌ FAIL 🟠 | `test-queue.resolver.ts:14`, `debug.resolver.ts:54,68,77` — `message`, `username`, `text` принимаются как `String` без maxLength и Zod | Добавить `createZodDto` для всех GraphQL аргументов с maxLength | Нет |
| BUG-02 | Missing await: `pubSub.publish()` не ожидается | ❌ FAIL 🟡 | `profile.resolver.ts:51` — `pubSub.publish()` возвращает Promise, не await/не catch — потеря событий при сбое Redis | Добавить `await` и `.catch()` | Нет |
| API-07 | Версионирование включено, но не настроено | ❌ FAIL 🟡 | `main.ts:41` — `app.enableVersioning()` без параметров; ни один контроллер не использует `@Version()` — мёртвый код | Настроить стратегию или убрать | Нет |
| YAGNI-04 | i18n переусложнён — полная интернационализация ради одного testTranslation в dev | ❌ FAIL 🟡 | `app.module.ts:112-126` — I18nModule с 2 языками, файловой системой, watcher; используется только в `debug.resolver.ts:49-62` | Удалить i18n или загружать условно | Нет |

**ACCEPTED:** нет

---

## Компонент: API (REST)

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| API-02 | Несоответствие Swagger и фактического HTTP-статуса | ❌ FAIL 🟠 | `file-upload.controller.ts:32,49` — `@HttpCode(201)` но `@ApiResponse({ status: 200 })` | Исправить `@ApiResponse({ status: 201 })` | Нет |
| API-01 / API-03 | Нестандартный формат ошибок в LoggerServeController | ❌ FAIL 🟡 | `logger-serve.controller.ts:59,83,93,125` — прямые `response.send(text)` без `statusCode`, `requestId`, `timestamp`; плоский текст вместо JSON | Заменить на `throw new HttpException()` для совместимости с `AllExceptionsFilter` | Нет |
| ARCH-08 | `FileUploadController` в `providers` и `controllers` одновременно | ❌ FAIL 🟡 | `file-upload.module.ts:8` — контроллер указан в `providers`, может вызвать двойную инициализацию | Удалить из `providers` | Нет |
| ARCH-09 | `FileUploadModule` экспортирует контроллер | ❌ FAIL 🟢 | `file-upload.module.ts:10` — `exports: [FileUploadController]` — контроллеры не должны экспортироваться | Удалить из `exports` или экспортировать сервис | Нет |

**ACCEPTED:**
| API-06 | Пагинация не реализована — на данном этапе не требуется | ⏸ ACCEPTED | — | — | — |

---

## Компонент: База данных

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| PERF-05 | Нет индексов на `Upload` (`uploaderIp`, `createdAt`) | ❌ FAIL 🟠 | `schema.prisma:30-42` — только уникальный индекс на `filepath`; поля `uploaderIp` и `createdAt` не индексированы | Добавить `@@index([uploaderIp])` и `@@index([createdAt])` | Нет |
| MATRIX-D1 | Нет statement timeout у Prisma | ❌ FAIL 🟠 | `prisma.service.ts:40` — `queryTimeout/statement_timeout` не настроен; медленный запрос может висеть минутами, занимая пул | Добавить `statement_timeout` через Prisma | Нет |
| MATRIX-D2 | Пул соединений Prisma = 10 — может быть узким | ❌ FAIL 🟡 | `prisma.service.ts:33` — `max: 10`; под нагрузкой 11-й запрос ждёт свободное соединение | Увеличить до 20-25 | Нет |
| ERR-08 | Retry без jitter в Prisma | ❌ FAIL 🟡 | `prisma.service.ts:51` — `Math.min(attempt * 1000, 5000)` — линейный backoff, нет jitter | Добавить jitter для предотвращения thundering herd | Нет |

**ACCEPTED:**
| PERF-06 | Нет составных индексов на Profile — для текущей нагрузки достаточно | ⏸ ACCEPTED | — | — | — |
| PERF-09 | Пул Prisma = 10 — принято для текущей нагрузки | ⏸ ACCEPTED | — | — | — |

---

## Компонент: Файловый менеджмент

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| PERF-01 | Загрузка файлов — полное чтение в память вместо стриминга | ❌ FAIL 🔴 | `file-upload.service.ts:70` — `part.toBuffer()` читает весь файл в ОЗУ; при 10 одновременных файлах до 5MB — до 100MB буферов | Использовать стриминг: `part.file.pipe()` | Нет |
| OWA-01 / VAL-08 | SVG (`image/svg+xml`) разрешён — XSS-вектор | ❌ FAIL 🟠 | `file-upload.service.ts:19-25` — SVG в `ALLOWED_MIME_TYPES`; файлы раздаются без CSP-заголовков | Убрать SVG или добавить CSP `sandbox` | Нет |
| OWA-02 | `GET /uploads/*` не имеет `@UseGuards` | ❌ FAIL 🟠 | `file-upload.controller.ts:81` — любой пользователь может читать загруженные файлы | Добавить `@UseGuards(JwtAuthGuard)` | Нет |
| PERF-02 | Отклонённые файлы тоже читаются в память | ❌ FAIL 🟡 | `file-upload.service.ts:59` — `part.toBuffer()` вызывается даже при неразрешённом MIME-типе | Убрать `toBuffer()` из блока отклонения | Нет |
| VAL-08 | MIME тип проверяется из `part.mimetype` (client-reported), а не по содержимому | ❌ FAIL 🟡 | `file-upload.service.ts:58` — клиент может подменить MIME-тип | Проверять по magic bytes | Нет |
| BUG-07 / CON-03 | TOCTOU: проверка файла и чтение не атомарны | ❌ FAIL 🟢 | `file-upload.service.ts:46-48`, `file-upload.controller.ts:94` — `access()` → `createReadStream()`; файл может быть удалён между check и read | Добавить `.on('error')` на стрим | Нет |
| NAM-01 | UPPER_CASE именование полей класса | ❌ FAIL 🟢 | `file-upload.service.ts:17-19` — `UPLOAD_DIR`, `DEFAULT_MIME_TYPE`, `ALLOWED_MIME_TYPES` | Переименовать в camelCase | Нет |

**ACCEPTED:** нет

---

## Компонент: Профили

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| CON-02 | Race condition инвалидации кеша при updateProfile | ❌ FAIL 🟠 | `profile.service.ts:24-27` — между `prisma.update` и `redis.del()` другой запрос может прочитать старый кеш | Удалять кеш до обновления БД или использовать SET с новыми данными | Нет |
| BUG-02 | Missing await: `pubSub.publish()` в updateProfile | ❌ FAIL 🟡 | `profile.resolver.ts:51` — `pubSub.publish()` без await — потеря событий при сбое Redis | Добавить `await` | Нет |
| PERF-04 | Нет write-through кэша при updateProfile | ❌ FAIL 🟢 | `profile.service.ts:24-27` — кеш удаляется, но новый профиль не записывается в Redis; следующий запрос идёт в БД | После update записать в Redis напрямую | Нет |
| ARC-13 | `ProfileModule` экспортирует `ProfileService`, который никем не используется | ❌ FAIL 🟢 | `profile.module.ts:9` — `exports: [ProfileService]`, но ни один другой модуль не импортирует его | Удалить из exports | Нет |

**ACCEPTED:** нет

---

## Компонент: Фоновые задачи

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| PERF-07 | BullMQ concurrency не указан (по умолчанию 1) | ❌ FAIL 🟡 | `test-queue.processor.ts:5` — `@Processor('test')` без `{ concurrency: N }` | Явно указать `concurrency` | Нет |
| BUG-07 | `getJob` с dedup-ID никогда не находит job (dead code) | ❌ FAIL 🟢 | `test-queue.resolver.ts:17-18` — `jobId` — это ID дедупликации, а не ID задачи | Убрать `getJob` целиком | Нет |

**ACCEPTED:** нет

---

## Компонент: Health Checks

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| MATRIX-H2 | Нет отдельного таймаута на healthcheck | ❌ FAIL 🟡 | `health.module.ts` — Terminus использует дефолтный таймаут, может ждать долго | Добавить `timeout` в TerminusModule | Нет |

**ACCEPTED:** нет

---

## Компонент: Dev Tools

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| OWA-05 / YAGNI-04 | Dev-модули доступны в production (без проверки NODE_ENV) | ❌ FAIL 🟠 | `app.module.ts:75-81` — `DevLauncherModule`, `LoggerServeModule`, `PrismaStudioModule`, `DebugModule` грузятся безусловно | Оборачивать импорт в `NODE_ENV !== 'production'` | Нет |
| LOG-08 | PrismaStudioService логирует 401/403 как `error` вместо `warn` | ❌ FAIL 🟠 | `prisma-studio.service.ts:39,49,59` — клиентские ошибки на уровне error | Исправить на `logger.warn()` | Нет |
| OWA-07 | Debug query утекает информацию о сервере | ❌ FAIL 🟡 | `debug.resolver.ts:83-127` — query `debug` возвращает uptime, память, версию, commit; RolesGuard не подключён | Добавить `RolesGuard` в `@UseGuards` | Нет |
| ARCH-14 | Бизнес-логика в presentation слое (DebugResolver) | ❌ FAIL 🟢 | `debug.resolver.ts:84-127` — расчёт uptime, чтение commit-info, memory usage прямо в резолвере | Вынести в `DebugService` | Нет |

**ACCEPTED:** нет

---

## Компонент: Логирование

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| LOG-04 | Нет requestId в сервисных логах — цепочку запроса восстановить нельзя | ❌ FAIL 🟡 | `ProfileService`, `FileUploadService`, `TestQueueProcessor` логируют без requestId и userId | Пробросить requestId через AsyncLocalStorage или DI | Нет |
| LOG-07 | User input не санитизирован перед логированием (log injection) | ❌ FAIL 🟡 | `debug.resolver.ts:69`, `file-upload.service.ts:96` — user input (`text`, `originalFilename`) идёт напрямую в лог | Санитизировать управляющие символы | Нет |
| BUG-02 | `JSON.parse(truncated)` в GQL-logging interceptor может упасть | ❌ FAIL 🟡 | `gql-logging.interceptor.ts:49-51` — обрезка JSON по байтам без учёта границ токенов → SyntaxError → 500 | Убрать JSON-обрезку или делать на границе ключа | Нет |
| ERR-10 | `console.*` в `git-commit-saver.ts` вместо Logger | ❌ FAIL 🟢 | `git-commit-saver.ts:21,33,46` — `console.error` в build-time скрипте | Заменить на Logger или оставить (допустимо для build-time) | Нет |

**ACCEPTED:**
| PERF-11 | JSON truncation в логах — неэффективно для больших ответов | ⏸ ACCEPTED | — | — | — |

---

## Компонент: Кеш/Redis

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| MATRIX-E1 | Нет таймаута на Redis-команды | ❌ FAIL 🟠 | `redis.service.ts` — ioredis команды не имеют встроенного таймаута; Redis висит → сервис зависает | Добавить таймаут через promise-race с setTimeout | Нет |
| CON-06 | `maxRetriesPerRequest: null` — бесконечные ретраи при падении Redis | ❌ FAIL 🟡 | `redis.service.ts:22` — все requests ждут восстановления без circuit breaker | Установить конечное значение (например, 20) | Нет |
| YAGNI-03 | `RedisService` — тонкая обёртка без дополнительной логики | ❌ FAIL 🟢 | `redis.service.ts` — только `getClient()`, нет кэширования, retry logic | Оставить как единую точку конфигурации или интеграции с BullMQ | Нет |

**ACCEPTED:**
| PERF-08 | Redis `lazyConnect: true` — задержка ~1-5ms на первом запросе | ⏸ ACCEPTED | — | — | — |

---

## Компонент: Инфраструктура

| Check ID | Проверка | Статус | Доказательство | Решение | Исправлено |
|----------|----------|--------|----------------|---------|------------|
| DEP-02 | Dockerfile.database-backup запускается от root | ❌ FAIL 🟠 | `Dockerfile.database-backup:1-7` — нет `USER` директивы; контейнер бежит от root | Добавить `USER node` | Нет |
| DEP-10 | `npm i` в Dockerfile.database-backup вместо `npm ci` | ❌ FAIL 🟠 | `Dockerfile.database-backup:4` — без lockfile-гарантий | Заменить на `npm ci` | Нет |
| SEC | Hardcoded placeholder-пароли в Dockerfile | ❌ FAIL 🟠 | `Dockerfile:7` — `DATABASE_PASSWORD=placeholder` в build stage | Передавать через `--build-arg` | Нет |
| SEC | Fallback-пароль `postgres` в backup/restore скриптах | ❌ FAIL 🟠 | `backup.ts:26`, `restore.ts:22` — `DATABASE_PASSWORD || 'postgres'` — скрывает ошибку конфигурации | Убрать fallback, требовать явного указания | Нет |
| SEC | Git history содержит реальные OIDC credentials | ❌ FAIL 🔴 | `.env.example` исторически содержал `sl51b8k688hfuw9it0dqz` и URL провайдера; доступны в 7+ коммитах | Очистить git history через `git filter-repo` или сменить Client ID | Нет |
| DEP-01 | Плавающие теги образов (`node:lts-alpine`, `:latest`) | ❌ FAIL 🟡 | `Dockerfile:1,9`, `Dockerfile.database-backup:1`, `docker-compose.yml:64,97` | Заменить на конкретные версии | Нет |
| DEP-04 | `.git` не исключён из `.dockerignore` | ❌ FAIL 🟡 | `.dockerignore:1-7` — нет `.git`, вся git-история идёт в build context | Добавить `.git` | Нет |
| DEP-11 | Нет ограничений ресурсов в docker-compose | ❌ FAIL 🟡 | `docker-compose.yml:10-139` — ни один сервис не имеет `deploy.resources.limits` | Добавить memory/cpu limits | Нет |
| YAGNI-02 | Мёртвые зависимости: `class-transformer`, `class-validator` | ❌ FAIL 🟡 | `package.json:70-71` — не импортируются нигде в `src/`; используется `nestjs-zod` | Удалить из package.json | Нет |
| YAGNI-04 | Dev-модули грузятся безусловно (также OWA-05 🟠) | ❌ FAIL 🟡 | `app.module.ts:75-81` — 5 dev-модулей в production | Условный импорт по NODE_ENV | Нет |
| YAGNI-04 | `enableVersioning()` без единого использования | ❌ FAIL 🟡 | `main.ts:41` — мёртвый код подготовки к версионированию | Удалить или внедрить | Нет |
| TST-04 | `auth.service.ts` имеет 0% покрытие тестами | ❌ FAIL 🟡 | `auth.service.ts` — 3 критических метода без единого теста | Написать unit-тесты | Нет |
| SEC | Слабые дефолтные пароли dev-инструментов | ❌ FAIL 🟡 | `.env.example` — `BULL_BOARD_PASSWORD=admin`, `PRISMA_STUDIO_PASSWORD=admin` и т.д. | Добавить предупреждение, документировать риск | Нет |
| DEP-08 | `.env.example` неполный — нет `NODE_ENV`, `TZ`, `DATABASE_URL`, required/optional маркировки | ❌ FAIL 🟢 | `.env.example:1-54` | Дополнить все переменные с маркировкой | Нет |
| DEP-12 | Нет `read_only: true` для контейнеров | ❌ FAIL 🟢 | `docker-compose.yml:10-139` — ни один сервис не имеет read-only FS | Добавить `read_only: true` для app | Нет |
| ARC-10 | Импорт `package.json` относительным путём (`../../../`) | ❌ FAIL 🟢 | `setup-app.ts:15`, `pino-config.ts:6`, `debug.resolver.ts:16` | Вынести в сервис или добавить `@root/` алиас | Нет |
| YAGNI-02 | Мёртвые зависимости: `@nestjs/websockets`, `graphql-ws` | ❌ FAIL 🟢 | `package.json:65,76` — не импортируются | Удалить | Нет |
| NAM-05 | Magic numbers в коде (10000, 30000, 5000 и т.д.) | ❌ FAIL 🟢 | `redis.service.ts:21-24`, `prisma.service.ts:30-32,51`, `file-upload.service.ts:67` | Вынести в именованные константы | Нет |

**ACCEPTED:**
| ARC-05 | `process.env` в bootstrap/config-файлах — доступ к ConfigService ограничен | ⏸ ACCEPTED | — | — | — |
| ARC-11 | Тесты используют относительные пути (`../../../test/utils/`) — вне `src/`, `@/` алиас не работает | ⏸ ACCEPTED | — | — | — |
| PERF-10 | `child_process.exec` в backup.ts — буферизация stdout — для MVP принято | ⏸ ACCEPTED | — | — | — |

---

## Сводка

| Компонент | ❌ FAIL 🔴 | ❌ FAIL 🟠 | ❌ FAIL 🟡🟢 | ⏸ ACCEPTED | Итого FAIL |
|-----------|:---------:|:---------:|:-----------:|:-----------:|:----------:|
| Аутентификация | 1 | 3 | 4 | 0 | 8 |
| API (GraphQL) | 0 | 1 | 3 | 0 | 4 |
| API (REST) | 0 | 1 | 2+1🟢 | 1 | 4 |
| База данных | 0 | 2 | 2 | 2 | 4 |
| Файловый менеджмент | 1 | 2 | 2+2🟢 | 0 | 7 |
| Профили | 0 | 1 | 1+2🟢 | 0 | 4 |
| Фоновые задачи | 0 | 0 | 1+1🟢 | 0 | 2 |
| Health Checks | 0 | 0 | 1 | 0 | 1 |
| Dev Tools | 0 | 2 | 1+1🟢 | 0 | 4 |
| Логирование | 0 | 0 | 3+1🟢 | 1 | 4 |
| Кеш/Redis | 0 | 1 | 1+1🟢 | 1 | 3 |
| Инфраструктура | 1 | 4 | 6+5🟢 | 3 | 16 |
| **ИТОГО** | **3** | **17** | **28+13🟢** | **8** | **61** |

> 🟡🟢 — объединённый столбец; количество после `+` — 🟢 находки.
> Итого FAIL = 🔴 + 🟠 + 🟡 + 🟢 (без ACCEPTED).

---

## Критические риски (FAIL 🔴)

### 🔴 OWA-06 / VAL-04 — Аутентификация
**Файл:** `src/common/auth/jwt-auth.guard.ts:30-51`
**Проверка:** OIDC_MOCK — полный обход аутентификации. `x-mock-sub` header позволяет притвориться любым пользователем. В `.env.example` включён по умолчанию.
**Доказательство:** Guard принимает mock-режим без проверки `NODE_ENV`. Default-пользователь имеет роль ADMIN.
**Решение:** Добавить проверку `NODE_ENV === 'development'`; убрать mock из production-сборки; установить `OIDC_MOCK_ENABLED=false` в `.env.example`.

---

### 🔴 PERF-01 — Файловый менеджмент
**Файл:** `src/modules/file-upload/file-upload.service.ts:70`
**Проверка:** Загрузка файлов — полное чтение в память вместо стриминга.
**Доказательство:** `part.toBuffer()` читает весь файл в ОЗУ → `writeFile` на диск. При 10 одновременных файлах по 5MB — до 100MB буферов.
**Решение:** Использовать стриминг `part.file.pipe()`.

---

### 🔴 SEC (Git history) — Инфраструктура
**Файл:** Git history
**Проверка:** Git history содержит реальные OIDC credentials (Client ID `sl51b8k688hfuw9it0dqz`, issuer URL `https://oalmxx.logto.app/oidc`) в 7+ коммитах.
**Доказательство:** Credentials заменены на placeholder'ы в коммите `9d9fa16`, но остались в истории.
**Решение:** Очистить git history через `git filter-repo` или BFG Repo-Cleaner; сменить Client ID у OIDC-провайдера.

---

## Высокие риски (FAIL 🟠) — ключевые

| Check ID | Компонент | Проблема | Файл |
|----------|-----------|----------|------|
| CON-01 | Аутентификация | Cache stampede — несколько concurrent запросов бьют в БД при кеш-миссе | `auth.service.ts:14-18` |
| CON-02 | Профили | Race condition инвалидации кеша — старый кес доступен после UPDATE DB | `profile.service.ts:24-27` |
| LOG-06/08 | Аутентификация | Нет аудит-логов входа, создания профиля, JWT-ошибок | `auth.service.ts`, `jwt.strategy.ts` |
| VAL-01/02 | API (GraphQL) | Аргументы без Zod-схем и ограничений длины | `test-queue.resolver.ts:14`, `debug.resolver.ts:54,68,77` |
| API-02 | API (REST) | Swagger обещает 200, сервер отвечает 201 | `file-upload.controller.ts:32,49` |
| PERF-05 | База данных | Нет индексов на `Upload.uploaderIp`, `Upload.createdAt` | `schema.prisma:30-42` |
| MATRIX-D1 | База данных | Нет statement timeout у Prisma | `prisma.service.ts:40` |
| OWA-01/VAL-08 | Файловый менеджмент | SVG разрешён — XSS-вектор | `file-upload.service.ts:19-25` |
| OWA-02 | Файловый менеджмент | `GET /uploads/*` без аутентификации | `file-upload.controller.ts:81` |
| OWA-05/YAGNI-04 | Dev Tools / Инфраструктура | Dev-модули доступны в production | `app.module.ts:75-81` |
| LOG-08 | Dev Tools | PrismaStudio логирует 401/403 как error | `prisma-studio.service.ts:39,49,59` |
| MATRIX-E1 | Кеш/Redis | Нет таймаута на Redis-команды | `redis.service.ts` |
| DEP-02 | Инфраструктура | Backup-контейнер от root | `Dockerfile.database-backup` |
| DEP-10 | Инфраструктура | `npm i` без lockfile в backup | `Dockerfile.database-backup:4` |
| SEC | Инфраструктура | Placeholder-пароли в Dockerfile | `Dockerfile:7` |
| SEC | Инфраструктура | Fallback-пароль `postgres` в backup/restore | `backup.ts:26`, `restore.ts:22` |

---

## Дубликаты и неконсистентности (из meta-аудита)

| Проблема | Аудиты | Severity | Единая | Статус |
|----------|--------|----------|--------|--------|
| OIDC_MOCK bypass | OWASP 🔴 / Validation 🟠 / Secrets ⚠️ | 🔴 / 🟠 / ⚠️ | 🔴 | Скорректировано |
| SVG XSS | OWASP 🟠 / Validation 🟡 | 🟠 / 🟡 | 🟠 | Скорректировано |
| TOCTOU file | Bugs 🟢 / Concurrency 🟡 | 🟢 / 🟡 | 🟢 | Скорректировано |
| JSON.parse без try/catch | Errors 🟡 / Validation 🟡 | 🟡 / 🟡 | 🟡 | Согласовано |
| BullMQ concurrency | Concurrency (✅PASS) / Performance (🟡) | ✅ / 🟡 | 🟡 | Выводы противоречат |
| Dev-модули в prod | OWASP 🟠 / YAGNI 🟡 | 🟠 / 🟡 | 🟠 | Скорректировано |

---

## Мета-аудит: качество аудита

| ID | Статус | Описание |
|----|--------|----------|
| META-05 | ❌ 🟡 | Baseline не синхронизирован с ACCEPTED находками (пустой `accepted: []`, но 8 ACCEPTED в отчётах) |
| META-08 | ❌ 🟡 | `src/db-backup-tool/**` пропущен большинством аудитов |
| META-14 | ❌ 🟠 | BullMQ concurrency — противоречивые выводы CON-07 (✅PASS) vs PERF-07 (❌🟡) |
| META-17 | 🟡 | Ни одна находка не исправлена (~60 FAIL,全部 «Нет») |

> META-01..04 (пропущенные аудиты) — **решены**: audit-api-contracts, audit-deployment, audit-matrix, audit-verify проведены.

---

## Распределение по severity

| Severity | Количество |
|----------|:----------:|
| 🔴 Critical | 3 |
| 🟠 High | 17 |
| 🟡 Medium | 28 |
| 🟢 Low | 13 |
| ⏸ ACCEPTED | 8 |
| **Всего FAIL** | **61** |
| **Всего проверок** | **~160** |

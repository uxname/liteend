# Audit Report: Performance & Resources — 2026-05-21 18:30

## Scope
- Full codebase audit for performance anti-patterns, resource constraints, and scalability concerns.
- Critical paths: `src/common/prisma/`, `src/modules/file-upload/`, `src/modules/profile/`, GraphQL config, Redis, BullMQ.
- Audit against checklist of 8 check items (PERF-01 through PERF-08).

---

## Summary

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|---------------|---------|-----------|
| PERF-01 | N+1 запросов нет — Prisma включает relations через include/select | PASS (N/A) | Высокая | Схема Prisma (`prisma/schema.prisma`) содержит только 2 модели (`Profile`, `Upload`) без связей (relations). Все запросы используют `findUnique`, `update`, `upsert`, `createMany`, `count`. Циклы с Prisma-запросами отсутствуют. | Нет отношений — N+1 невозможен. При добавлении отношений — использовать `include`/`select`. | Нет |
| PERF-02 | Нет блокирующих вызовов в async контексте (readFileSync, execSync) | FAIL | Высокая | **Найдено 5+ синхронных I/O вызовов в async контексте:**<br>1. `src/modules/file-upload/file-upload.service.ts:44` — `fs.existsSync()` в `getSafeFileInfo()`<br>2. `src/modules/file-upload/file-upload.service.ts:65` — `fs.statSync()` в `processFile()`<br>3. `src/modules/file-upload/file-upload.service.ts:105-106` — `fs.existsSync()` + `fs.mkdirSync()` в `generatePaths()`<br>4. `src/dev-tools/debug/debug.resolver.ts:37` — `readFileSync()` в `readLastCommitInfo()`<br>5. `src/common/dotenv-validator/dotenv-validator.service.ts:14,17` — `fs.readFileSync()` (только не-prod, не hot path) | 1-3: Заменить на `fs.promises.access()`, `fs.promises.stat()`, `fs.promises.mkdir()` в `file-upload.service.ts`.<br>4: Заменить на `fs.promises.readFile()` в `debug.resolver.ts`. | ✅ Да |
| PERF-03 | GraphQL запросы имеют ограничения глубины/сложности (query depth limit) | FAIL | Высокая | В `app.module.ts:37-73` конфигурация `GraphQLModule` не содержит:<br>— `queryDepth` (ограничение глубины)<br>— `validationRules` (кастомные правила валидации)<br>— `maxQueryLength` / `maxQueryComplexity`<br>Параметры: `{ autoSchemaFile: true, graphiql: false, jit: 1, cache: false }` — depth limit отсутствует. | Добавить `queryDepth: 5` или использовать `graphql-query-complexity` через `validationRules`. Для Mercurius — опция `queryDepth` в конфиге драйвера. | ✅ Да |
| PERF-04 | File upload ограничен maxFileSize | FAIL | Высокая | В `src/bootstrap/setup-app.ts:18`: `app.register(multiPart)` вызван **без опций**. Ни `maxFileSize`, ни `limits` не переданы.<br>В `main.ts:14` `bodyLimit: 10485760` (10 MB) ограничивает тело запроса Fastify, но для multipart это не работает как `maxFileSize`.<br>В `file-upload.service.ts` нет проверки `part.file.truncated` или размера файла. | Добавить `app.register(multiPart, { limits: { fileSize: 5 * 1024 * 1024 } })` (5 MB). Проверять `part.file.truncated` после записи. | ✅ Да |
| PERF-05 | Запросы к БД имеют лимиты (take, cursor-based pagination) | PASS (N/A) | Высокая | Во всей кодовой базе нет ни одного вызова `prisma.findMany()`. Все запросы — единичные: `findUnique`, `update`, `upsert`, `createMany`, `count`. Пагинация не требуется. | При добавлении списковых запросов — использовать `take` + `cursor` (cursor-based pagination), не `skip`. | Нет |
| PERF-06 | Пул соединений к БД/Redis ограничен и мониторится | PARTIAL | Средняя | **Prisma (pg Pool):** `prisma.service.ts:22` — `new Pool({ connectionString })` без `max`/`min`/`idleTimeoutMillis`. Используются defaults pg Pool (`max: 10`).<br>**Redis:** `redis.service.ts:17` — `new Redis({ host, port, password })` без `maxRetriesPerRequest`, `lazyConnect`, `enableReadyCheck`, `retryStrategy`.<br>**Health:** `health.controller.ts` — есть проверки DB ping, Redis ping, heap memory (150MB), disk (>90%). | 1) Prisma: передать `Pool({ connectionString, max: 10, idleTimeoutMillis: 30000 })`.<br>2) Redis: добавить `lazyConnect: true`, `maxRetriesPerRequest: null`, `retryStrategy`. Подключиться в `onModuleInit`.<br>3) Мониторинг пула через Prometheus/metrics (опционально). | ✅ Да |
| PERF-07 | Нет blocking операций в event loop (тяжёлые regex, sync I/O в hot path) | FAIL | Высокая | **В hot path file-upload:**<br>1. `fs.existsSync()` — блокировка event loop на каждый запрос загрузки/получения файла.<br>2. `fs.statSync()` — блокировка после stream pipeline.<br>3. `fs.mkdirSync()` — блокировка при создании директории.<br>**Тяжёлые regex:** не обнаружены (парсинг `.env` через `split('\n')` — простой).<br>**Sync I/O не в hot path:** `git-commit-saver.ts`, `dotenv-validator.service.ts` — только при старте/build. | Использовать `fs.promises` API: `await fs.promises.stat()`, `await fs.promises.mkdir()`, async-проверку `access()`. См. PERF-02. | ✅ Да |
| PERF-08 | Кэширование настроено для часто запрашиваемых данных | FAIL | Высокая | **Нет кэширования на уровне приложения:**<br>— `app.module.ts:45`: `cache: false` для GraphQL (отключено).<br>— Нет `CacheModule` или `CacheInterceptor` нигде в коде.<br>— Redis доступен, но не используется для кэша данных (используется только BullMQ и mqemitter).<br>— `jwks-rsa` имеет `cache: true` для JWKS-ключей — это единственный кэш.<br>— Профили (Profile) запрашиваются при каждом запросе через JWT guard без кэширования. | 1) Включить `cache: true` для GraphQL (или настроить кэширование схемы).<br>2) Использовать Redis для кэша профилей (`GET profile:{id}` с TTL 5-60 мин).<br>3) Рассмотреть `@nestjs/cache-manager` для REST/GraphQL кэша. | ✅ Да |

---

## Audit Coverage

| Компонент | Файлы проверены | Статус |
|-----------|----------------|--------|
| Prisma schema, service, module | `prisma/schema.prisma`, `src/common/prisma/prisma.service.ts`, `src/common/prisma/prisma.module.ts` | Проверено |
| Profile service/resolver | `src/modules/profile/profile.service.ts`, `src/modules/profile/profile.resolver.ts`, `src/modules/profile/profile.module.ts`, `src/modules/profile/types/*.ts` | Проверено |
| File Upload service/controller/module | `src/modules/file-upload/*.ts` (5 файлов) | Проверено |
| Bootstrap/App setup | `src/bootstrap/setup-app.ts`, `src/main.ts`, `src/app.module.ts`, `src/app.controller.ts` | Проверено |
| Redis service/module | `src/common/redis/*.ts` (2 файла) | Проверено |
| GraphQL error formatter | `src/common/graphql/*.ts` (2 файла) | Проверено |
| Test Queue processor/resolver/module | `src/infrastructure/test-queue/*.ts` (4 файла) | Проверено |
| Auth (JWT) | `src/common/auth/jwt.strategy.ts`, `src/common/auth/jwt-auth.guard.ts` | Проверено |
| Health checks | `src/infrastructure/health/health.controller.ts`, `src/infrastructure/health/indicators/redis.health.ts` | Проверено |
| Sync I/O (все вхождения) | Grep: `readFileSync`, `execSync`, `existsSync`, `mkdirSync`, `writeFileSync`, `statSync` | Проверено (33 совпадения) |
| Prisma запросы | Grep: все `prisma.model.*()` вызовы | Проверено (5 уникальных вызовов) |
| Pagination | Grep: `take`, `skip`, `cursor`, `limit`, `paginate` | Проверено (нет в production коде) |
| Caching | Grep: `cache`, `CacheModule`, `CacheInterceptor`, `redis` в модулях | Проверено |

---

## Detailed Findings

### PERF-01: N+1 — PASS (N/A)
- **Схема**: две изолированные модели `Profile` и `Upload` — без `@relation`, без foreign keys.
- **Запросы**: все 5 Prisma-запросов — единичные точечные операции. Нигде нет циклов с повторными запросами.
- **Риск**: при расширении схемы с добавлением отношений необходимо сразу использовать `include` или `select` для eager loading.

### PERF-02: Sync I/O in async context — FAIL
**Основные проблемные места:**

**1. `src/modules/file-upload/file-upload.service.ts` (3 точки)**
- `getSafeFileInfo()` (L44): `fs.existsSync()` — вызывается при каждом GET `/uploads/*`.
- `processFile()` (L65): `fs.statSync()` — вызывается при каждом POST `/upload`.
- `generatePaths()` (L105-106): `fs.existsSync()` + `fs.mkdirSync()` — вызывается при каждом POST `/upload`.

**2. `src/dev-tools/debug/debug.resolver.ts` (L37)**
- `readFileSync()` — dev tool, редко, но блокирует event loop в GraphQL resolver.

**3. `src/common/git-commit-saver.ts` — build-only, не в runtime.**
**4. `src/common/dotenv-validator/dotenv-validator.service.ts` — constructor, non-prod, не в hot path.**

### PERF-03: GraphQL depth limit — FAIL
**Конфигурация в `app.module.ts:37-73`:**
```typescript
GraphQLModule.forRootAsync<MercuriusDriverConfig>({
  driver: MercuriusDriver,
  useFactory: async () => ({
    autoSchemaFile: true,
    graphiql: false,
    jit: 1,
    cache: false,
    // NO queryDepth, NO validationRules, NO maxQueryLength
    // NO complexity limit
  }),
})
```
- Нет защиты от глубоко вложенных запросов (billion laughs / resource exhaustion).
- `jit: 1` — хорошо (JIT-компиляция для производительности).
- `graphiql: false` — хорошо (отключено в production).

**Рекомендация:**
```typescript
{
  queryDepth: 8,
  // или через validationRules: [depthLimit(8)]
}
```
Либо использовать `graphql-query-complexity` для cost-based analysis.

### PERF-04: File upload size limit — FAIL
- `@fastify/multipart` зарегистрирован без `limits`.
- `main.ts: bodyLimit: 10485760` защищает только тело HTTP-запроса, но не размер каждого файла в multipart.
- Злоумышленник может загрузить файлы произвольного размера, вызывая OOM или исчерпание диска.
- В `file-upload.service.ts` проверяется только MIME-тип, размер не валидируется.

**Рекомендация:**
```typescript
await app.register(multiPart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 10,  // max 10 files per request
  },
});
```

### PERF-05: DB query limits — PASS (N/A)
- Ни одного `findMany` — пагинация не нужна.
- Для будущих списковых запросов рекомендуется cursor-based пагинация с `take`, а не `skip` (избежать проблем с производительностью на больших таблицах).

### PERF-06: Connection pool — PARTIAL
**Prisma (pg Pool):**
- `new Pool({ connectionString })` — no `max`/`min` options → используется pg Pool default: `max: 10`.
- При пиковых нагрузках может не хватить соединений (нет конфигурации).
- `idleTimeoutMillis` не установлен → соединения могут висеть бесконечно.

**Redis:**
- `new Redis({ host, port, password })` — ioredis defaults: `maxRetriesPerRequest: 3`, `lazyConnect: false`.
- `lazyConnect: false` → соединение устанавливается сразу при создании экземпляра, ещё до `onModuleInit`.
- Нет `retryStrategy` — в случае падения Redis не будет экспоненциальной задержки.

**Health checks** — хороший мониторинг: DB ping + Redis ping + heap (150MB) + disk (>90%).

### PERF-07: Event loop blocking — FAIL
- См. PERF-02 — те же 5 точек синхронного I/O.
- Дополнительно: `fs.createWriteStream` + `pipeline` в `processFile()` — хорошо (асинхронный stream).
- Тяжёлые regex: не обнаружены.
- `JSON.parse(readFileSync(...))` в `debug.resolver.ts` — двойная блокировка.

### PERF-08: Caching — FAIL
- **Нет слоя кэширования:**
  - GraphQL `cache: false`.
  - Нет `CacheModule` из `@nestjs/cache-manager`.
  - Redis не используется как кэш данных.
- **JWKS caching** — единственный активный кэш: `passportJwtSecret({ cache: true, rateLimit: true, jwksRequestsPerMinute: 5 })`.
- **Profile upsert при каждом запросе:** `jwt.strategy.ts:50` вызывает `prisma.profile.upsert()` на каждый запрос с JWT. Частота: каждый HTTP/graphql запрос. Это может быть узким местом при масштабировании.
- **Рекомендация:**
  1. Включить `cache: true` для GraphQL (кэш схемы/парсинга).
  2. Использовать Redis: `GET profile:{oidcSub}` + SET с TTL 300-600 секунд.
  3. Добавить `@nestjs/cache-manager` с Redis store для REST API.

---

## Raw Findings

### Prisma queries (all)
| Файл | Строка | Запрос | Тип |
|------|--------|--------|-----|
| `jwt.strategy.ts` | 50 | `this.prisma.profile.upsert({ where: { oidcSub } })` | Единичный |
| `jwt-auth.guard.ts` | 41 | `this.prisma.profile.findUnique({ where: { oidcSub: mockSub } })` | Единичный |
| `jwt-auth.guard.ts` | 51 | `this.prisma.profile.upsert({ where: { oidcSub: 'mock-oidc-sub' } })` | Единичный |
| `debug.resolver.ts` | 91 | `this.prisma.profile.count()` | Единичный |
| `profile.service.ts` | 11 | `this.prisma.profile.update({ where: { id }, data })` | Единичный |
| `file-upload.service.ts` | 82 | `this.prisma.upload.createMany({ data: [...] })` | Batch |

### Sync I/O calls
| Файл | Строка | Вызов | В hot path? |
|------|--------|-------|-------------|
| `file-upload.service.ts` | 44 | `fs.existsSync(resolvedPath)` | YES |
| `file-upload.service.ts` | 65 | `fs.statSync(fullPath)` | YES |
| `file-upload.service.ts` | 105 | `fs.existsSync(fullDir)` | YES |
| `file-upload.service.ts` | 106 | `fs.mkdirSync(fullDir, { recursive: true })` | YES |
| `debug.resolver.ts` | 37 | `readFileSync(LAST_COMMIT_INFO_FILE_PATH, 'utf8')` | Dev-only |
| `dotenv-validator.service.ts` | 14,17 | `fs.readFileSync(...)` | Non-prod init |
| `git-commit-saver.ts` | 18,30,42,43 | `execSync(...)` | Build-time |
| `git-commit-saver.ts` | 52,53,60 | `existsSync`, `mkdirSync`, `writeFileSync` | Build-time |

---

## Recommendations (Priority-Ordered)

| Приоритет | Действие | Чек-ID | Оценка усилий |
|-----------|----------|--------|---------------|
| P0 | Установить `maxFileSize` для `@fastify/multipart` | PERF-04 | 1 час |
| P0 | Добавить `queryDepth` в GraphQL конфиг | PERF-03 | 1 час |
| P1 | Заменить sync I/O на async в `file-upload.service.ts` | PERF-02, PERF-07 | 2 часа |
| P1 | Настроить Redis-кэш для профилей | PERF-08 | 4 часа |
| P2 | Конфигурировать размер пула соединений Prisma и Redis | PERF-06 | 2 часа |
| P3 | Включить GraphQL cache | PERF-08 | 1 час |
| P3 | Добавить `retryStrategy` для ioredis | PERF-06 | 1 час |

---

## Files Referenced

- `/home/dex/Документы/Work/liteend/prisma/schema.prisma`
- `/home/dex/Документы/Work/liteend/src/common/prisma/prisma.service.ts`
- `/home/dex/Документы/Work/liteend/src/common/prisma/prisma.module.ts`
- `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.service.ts`
- `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.controller.ts`
- `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.module.ts`
- `/home/dex/Документы/Work/liteend/src/modules/profile/profile.service.ts`
- `/home/dex/Документы/Work/liteend/src/modules/profile/profile.resolver.ts`
- `/home/dex/Документы/Work/liteend/src/modules/profile/profile.module.ts`
- `/home/dex/Документы/Work/liteend/src/modules/profile/types/profile.object-type.ts`
- `/home/dex/Документы/Work/liteend/src/modules/profile/types/profile-update.input.ts`
- `/home/dex/Документы/Work/liteend/src/bootstrap/setup-app.ts`
- `/home/dex/Документы/Work/liteend/src/main.ts`
- `/home/dex/Документы/Work/liteend/src/app.module.ts`
- `/home/dex/Документы/Work/liteend/src/app.controller.ts`
- `/home/dex/Документы/Work/liteend/src/common/redis/redis.service.ts`
- `/home/dex/Документы/Work/liteend/src/common/redis/redis.module.ts`
- `/home/dex/Документы/Work/liteend/src/common/graphql/error-formatter.ts`
- `/home/dex/Документы/Work/liteend/src/common/graphql/error-formatter.spec.ts`
- `/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/test-queue.processor.ts`
- `/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/test-queue.resolver.ts`
- `/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/test-queue.module.ts`
- `/home/dex/Документы/Work/liteend/src/common/auth/jwt.strategy.ts`
- `/home/dex/Документы/Work/liteend/src/common/auth/jwt-auth.guard.ts`
- `/home/dex/Документы/Work/liteend/src/common/logger/gql-logging.interceptor.ts`
- `/home/dex/Документы/Work/liteend/src/common/all-exceptions-filter.ts`
- `/home/dex/Документы/Work/liteend/src/dev-tools/debug/debug.resolver.ts`
- `/home/dex/Документы/Work/liteend/src/infrastructure/health/health.controller.ts`
- `/home/dex/Документы/Work/liteend/src/infrastructure/health/indicators/redis.health.ts`
- `/home/dex/Документы/Work/liteend/src/common/dotenv-validator/dotenv-validator.service.ts`
- `/home/dex/Документы/Work/liteend/src/common/git-commit-saver.ts`
- `/home/dex/Документы/Work/liteend/.env`
- `/home/dex/Документы/Work/liteend/.env.example`
- `/home/dex/Документы/Work/liteend/package.json`

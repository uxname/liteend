# Матрица — LiteEnd — 2026-05-22

## TL;DR
- **Архитектура:** Монолит (1 NestJS-процесс) + Docker-контейнеры (PostgreSQL, Redis, pgAdmin, Redis Commander, db_backup)
- **Компонентов:** 12
- **Критических рисков (🔴/🟠):** 6
- **Главный риск:** База данных и Redis — единые точки отказа. Если хотя бы одна падает — весь сайт не работает. Ни у одного вызова нет таймаутов и предохранителей (circuit breaker), зависший Redis/БД вешает сервис целиком.

## Граф компонентов

| Кто \ Кого | Auth | GraphQL | REST API | DB (Prisma) | FileUpload | Profile | BullMQ | Health | DevTools | Logging | Redis | Docker-сеть |
|--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| **Auth** | — | даёт guards | даёт guards | ищет/создаёт профили | — | — | — | — | — | — | кеш sub->profile | — |
| **GraphQL** | использует guards | — | — | — | — | вызывает ProfileService | — | — | — | логирует GQL-запросы | — | — |
| **REST API** | использует guards | — | — | — | вызывает FileUploadService | — | — | проверяет БД | — | логирует REST-запросы | — | под CORS/Helmet |
| **DB (Prisma)** | — | — | — | — | сохраняет метаданные | читает/пишет профили | — | — | отладка | — | — | — |
| **FileUpload** | через JWT guard | — | — | сохраняет мета | — | — | — | — | — | — | — | — |
| **Profile** | через guards | — | — | пишет профили | — | — | — | — | — | — | сбрасывает кеш | — |
| **BullMQ** | — | — | — | — | — | — | — | — | — | логирует | хранит задачи/дедуп | — |
| **Health** | — | — | — | пингует БД | — | — | — | — | — | — | пингует Redis | — |
| **DevTools** | через guards | — | — | читает профили | — | — | — | — | — | — | — | — |
| **Logging** | — | подписка | подписка | — | — | — | — | — | — | — | — | — |
| **Redis** | кеш профилей | подписки GQL | — | — | — | инвалидация кеша | задачи + дедуп | пингуется | — | — | — | — |
| **Docker-сеть** | — | — | защищает | — | — | — | — | — | защищает | — | — | — |

Связей: **24**. Синхронных (ждут ответа): **20** — это главный источник каскадных падений.

## Критические задачи (🔴/🟠)

| # | В чём опасность | Компонент | Риск | Решение | Файл |
|---|----------------|-----------|------|---------|------|
| 1 | **🔴 БД падает — всё падает.** Auth не может найти/создать профиль, Profile не может обновить, FileUpload не сохраняет метаданные — все запросы падают с 500. | DB (Prisma) | 🔴 | Добавить statement timeout у Prisma (через `queryTimeout` в PrismaClient) + добавить кэш на чтение в Redis для Profile, чтобы отказ БД не ломал авторизацию | `src/common/prisma/prisma.service.ts:40` ❌ |
| 2 | **🔴 Redis падает — всё останавливается.** Auth не может кешировать профили (но работает), BullMQ не работает, GQL подписки ломаются, Profile не может сбросить кеш, Health падает. | Redis | 🔴 | Добавить graceful degradation: если Redis не отвечает — продолжать работу без кеша (уже частично есть `.catch(() => {})`), но нужен timeout на каждую операцию Redis | `src/common/redis/redis.service.ts:17` ❌ |
| 3 | **🟠 Нет таймаутов на Redis-операции.** Redis висит → Auth висит (findOrCreateProfile), Profile висит (updateProfile → del). Все запросы на эти операции подвисают. | Auth / Profile | 🟠 | Добавить timeout на каждый Redis-вызов (ioredis команды не имеют встроенного таймаута). Использовать `.pipe.timeout()` или promise-race | `src/common/auth/auth.service.ts:14` ❌ |
| 4 | **🟠 Пул соединений Prisma = 10.** Под нагрузкой (10 одновременных запросов) пул исчерпан → 11-й ждёт → очередь растёт → время ответа растёт → nginx/Fastify таймаут → 503. | DB (Prisma) | 🟠 | Увеличить `max` соединений до 20-30 (в зависимости от нагрузки) и/или добавить ограничение на RPS в Fastify | `src/common/prisma/prisma.service.ts:33` ❌ |
| 5 | **🟠 Нет statement timeout у Prisma.** Запрос к БД может висеть минутами (напр. `prisma.profile.count()` на миллионах записей) — пул занят, другие ждут. | DB (Prisma) | 🟠 | Добавить `statement_timeout` в PostgreSQL через `queryTimeout` Prisma или через `sessionVariables` в connect | `src/common/prisma/prisma.service.ts:40` ❌ |
| 6 | **🟠 GQL подписки зависят от Redis (mqemitter-redis).** Если Redis падает — подписки ломаются беззвучно (нет fallback). | GraphQL + Redis | 🟠 | Добавить fallback-emitter (одиночный процесс) или мониторинг состояния подписок с алертом. Или сделать mqemitter переключаемым | `src/app.module.ts:48` ❌ |

## Компоненты

### AuthModule

**Роль:** JWT-аутентификация через OIDC + RBAC. Создаёт/ищет профили, кеширует в Redis.
**Где:** In-process (NestJS).
**Найден:** `src/common/auth/auth.module.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| A1 | Redis тормозит | Auth ждёт ответ от Redis (get на `profile:sub:...`) без таймаута → запрос входа зависает → через 10 сек Fastify отдаёт 503 | 🟠 | Добавить таймаут 2-3 сек на Redis-вызовы | `src/common/auth/auth.service.ts:14` ❌ |
| A2 | БД недоступна | AuthService не может upsert профиль → UnauthorizedException. Пользователь не может войти. | 🔴 | Кэшировать последний успешный ответ в Redis + local cache на случай отказа БД при повторном входе | `src/common/auth/auth.service.ts:19` ❌ |
| A3 | JWT Strategy не может достучаться до JWKS URI | OIDC issuer недоступен → все JWT не верифицируются → ни один пользователь не авторизуется | 🔴 | Добавить fallback: кэшировать JWKS ключи локально с TTL, чтобы пережить временную недоступность OIDC-провайдера | `src/common/auth/jwt.strategy.ts:34` ❌ |
| A4 | Mock-режим (OIDC_MOCK_ENABLED) | В dev-режиме mock-аутентификация без проверки заголовков → кто угодно может представиться любым sub через `x-mock-sub` | 🟡 | Защита только на уровне "это dev". В production не включается по NODE_ENV. OK | `src/common/auth/jwt-auth.guard.ts:30` ✅ |

### GraphQL API

**Роль:** Принимает GraphQL-запросы (profile, debug, test-queue), обрабатывает ошибки, ведёт лог.
**Где:** In-process. **Найден:** `src/app.module.ts:36`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| G1 | GQL подписки отваливаются | Redis падает → mqemitter-redis теряет связь → подписки молча перестают работать | 🟠 | Добавить fallback-emitter (in-memory) + мониторинг | `src/app.module.ts:48` ❌ |
| G2 | Query depth = 8 | Ограничения на глубину нет (8 — большое значение для рекурсивных запросов) → потенциальный DoS на БД | 🟡 | Уменьшить `queryDepth` до 3-4, если нет циклических типов | `src/app.module.ts:44` ❌ |
| G3 | GQL error formatter | Ошибки нормально обрабатываются, логируются, возвращаются с кодом. Рисков нет. | 🟢 | — | `src/common/graphql/error-formatter.ts` ✅ |

### REST API (FileUpload, Health, DevTools)

**Роль:** REST-эндпоинты: загрузка файлов, health check, dev-tools.
**Где:** In-process. **Найден:** `src/modules/file-upload/file-upload.controller.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| R1 | FileUpload пишет в БД | Если БД тормозит — `saveMetadata` ждёт без таймаута → запрос на upload зависает → все 10 соединений заняты | 🟠 | Вынести `saveMetadata` в фоновую очередь (BullMQ) | `src/modules/file-upload/file-upload.service.ts:99` ❌ |
| R2 | FileUpload без rate-limit | /upload не защищён отдельным лимитом (использует общий 100/минута), но IP-ключ = `auth:{ip}` | 🟢 | OK — есть keyGenerator, который делает лимит по IP | `src/bootstrap/setup-app.ts:67` ✅ |
| R3 | File path traversal защищён | При проверке пути через `path.resolve` + `startsWith` — path traversal невозможен | 🟢 | OK | `src/modules/file-upload/file-upload.service.ts:41` ✅ |

### База данных (Prisma)

**Роль:** ORM-доступ к PostgreSQL: соединение, пул, повторные попытки старта.
**Где:** Docker-контейнер (postgres:18.1-alpine). **Найден:** `src/common/prisma/prisma.service.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| D1 | Запрос висит → пул занят | Нет statement_timeout → медленный запрос на 1 млн строк висит 5 минут → остальные 9 ждут → сервис падает | 🟠 | Добавить `statement_timeout` (через `queryTimeout` или `sessionVariables`) | `src/common/prisma/prisma.service.ts:40` ❌ |
| D2 | Пул соединений мал | `max: 10` — под нагрузкой 11-й запрос ждёт free connection → очередь → таймаут | 🟡 | Увеличить `max` до 20-25, в зависимости от доступной памяти БД | `src/common/prisma/prisma.service.ts:33` ❌ |
| D3 | Retry при старте | 5 попыток подключения с exponential backoff — при старте БД поднимается после 2-3 попыток | 🟢 | OK | `src/common/prisma/prisma.service.ts:44-58` ✅ |
| D4 | Docker healthcheck | app ждёт `db: service_healthy` — не стартует без БД | 🟢 | OK | `docker-compose.yml:30-34` ✅ |

### Redis (RedisService)

**Роль:** Кеш, хранилище задач BullMQ, брокер подписок GQL.
**Где:** Docker-контейнер (redis:8.4-alpine). **Найден:** `src/common/redis/redis.service.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| E1 | Нет таймаута на команды | Redis висит → `get()`, `set()`, `del()` не возвращаются → сервис зависает | 🟠 | Добавить командам timeout (через promise-race с setTimeout) | `src/common/redis/redis.service.ts:30` ❌ |
| E2 | RetryStrategy есть | RedisService имеет retryStrategy (0.2-3s) + lazyConnect — reconnect автоматический | 🟢 | OK | `src/common/redis/redis.service.ts:23-25` ✅ |
| E3 | BullMQ defaultJobOptions | 3 попытки + exponential backoff — хороший дефолт | 🟢 | OK | `src/app.module.ts:96-103` ✅ |

### FileUploadModule

**Роль:** Загрузка файлов на диск, сохранение метаданных в БД.
**Где:** In-process. **Найден:** `src/modules/file-upload/file-upload.module.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| F1 | File upload timeout для записи на диск | AbortController 30 сек — OK. Если диск медленный — abort через 30 сек. | 🟢 | OK | `src/modules/file-upload/file-upload.service.ts:66-67` ✅ |
| F2 | Сохранение метадаты в БД синхронно | После записи файла ждём `prisma.upload.createMany` — если БД тормозит, клиент ждёт | 🟡 | Вынести в фоновую очередь (BullMQ) — не критично для MVP | `src/modules/file-upload/file-upload.service.ts:99` ❌ |

### ProfileModule

**Роль:** CRUD профилей с кэшированием.
**Где:** In-process. **Найден:** `src/modules/profile/profile.module.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| P1 | Redis падает при сбросе кеша | `.catch(() => {})` — silent ignore, профиль обновляется в БД, кеш не сброшен => следующий read может получить старое значение | 🟡 | OK: cache invalidation — best-effort, данные не теряются | `src/modules/profile/profile.service.ts:26-27` ✅ |
| P2 | Нет таймаута на Redis del | Если Redis висит при `del()`, updateProfile зависает | 🟠 | Добавить таймаут на del | `src/modules/profile/profile.service.ts:24-27` ❌ |

### BullMQ (Test-queue)

**Роль:** Демо-очередь фоновых задач (тестовый воркер).
**Где:** In-process (WorkerHost). **Найден:** `src/infrastructure/test-queue/test-queue.module.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| Q1 | Redis падает → BullMQ не работает | Очередь полностью зависит от Redis. Без Redis — задачи не ставятся и не выполняются | 🟠 | Мониторинг Redis, автоматический reconnect (есть у ioredis) | `src/app.module.ts:84-106` ℹ️ |
| Q2 | Deduplication зависит от Redis | `deduplication.id` хранится в Redis — если Redis падает, dedup не гарантирован | 🟢 | Допустимо для тестовой очереди | `src/infrastructure/test-queue/test-queue.resolver.ts:25` ✅ |

### Health Checks (Terminus)

**Роль:** /health endpoint, проверка БД, Redis, памяти, диска.
**Где:** In-process. **Найден:** `src/infrastructure/health/health.module.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| H1 | Health пингует БД и Redis напрямую | Если БД/Redis тормозят, healthcheck сам становится медленным — это нормально (отражает реальность) | 🟢 | OK | `src/infrastructure/health/health.controller.ts:28-38` ✅ |
| H2 | Нет отдельного таймаута на healthcheck | Terminus имеет дефолтный таймаут — если не задан, может ждать долго | 🟡 | Добавить `timeout` в TerminusModule | `src/infrastructure/health/health.module.ts` ❌ |

### Dev Tools

**Роль:** Bull Board, Prisma Studio proxy, Debug resolver, Logger serve, Dev launcher.
**Где:** In-process. **Найден:** `src/dev-tools/`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| V1 | Prisma Studio запускает child process (`npm run db:studio`) | Child process может упасть → лог ошибки, но приложение продолжает работу. Если упадёт снова — не остановит app | 🟢 | OK — ошибка ловится catch | `src/dev-tools/prisma-studio/prisma-studio.service.ts:13-25` ✅ |
| V2 | Debug resolver читает файл `last-commit-info.json` | Файла нет → ошибка ловится, возвращается undefined | 🟢 | OK | `src/dev-tools/debug/debug.resolver.ts:37-47` ✅ |
| V3 | Bull Board Basic Auth | Если BULL_BOARD_LOGIN/PASSWORD не заданы — возвращает 401. Если заданы — проверка через Basic | 🟢 | OK | `src/dev-tools/bull-board/bull-board.module.ts:49-52` ✅ |

### Логирование (Pino + GQL interceptor)

**Роль:** Логи всех HTTP/GQL запросов, ротация файлов, удаление чувствительных данных.
**Где:** Global (nestjs-pino). **Найден:** `src/common/logger/logger.module.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| L1 | Redact sensitive data | Пароли, токены, секреты удаляются из логов (redact: remove: true) | 🟢 | OK | `src/common/logger/pino-config.ts:156-177` ✅ |
| L2 | GQL logging interceptor | Логирует все GQL-запросы с redact чувствительных полей и truncation ответов | 🟢 | OK | `src/common/logger/gql-logging.interceptor.ts` ✅ |
| L3 | Silent paths (health, etc.) | /health, /favicon.ico и т.д. не логируются — не забивают логи | 🟢 | OK | `src/common/logger/pino-config.ts:16-23` ✅ |
| L4 | Файловые логи ротируются | daily rotation + size limit 20m + 10 файлов — OK | 🟢 | OK | `src/common/logger/pino-config.ts:38-46` ✅ |

### Инфраструктура (Docker, CORS, Helmet, Rate Limiting)

**Роль:** Безопасность и оркестрация: CORS, Helmet, rate limit, Docker-сеть.
**Где:** Fastify-плагины. **Найден:** `src/bootstrap/setup-app.ts:1`

| # | Сценарий | В чём опасность | Риск | Решение | Файл |
|---|----------|-----------------|------|---------|------|
| I1 | Rate limit 100/минута на все эндпоинты | /studio и /board в allowList — rate limit их не трогает (но они под Basic Auth) | 🟢 | OK | `src/bootstrap/setup-app.ts:58-73` ✅ |
| I2 | CORS разрешает http://localhost:4000 | В production нужно ставить реальный домен — иначе CORS упадёт. В текущей конфигурации для dev OK | 🟢 | OK при правильной настройке CORS_ORIGIN в проде | `src/bootstrap/setup-app.ts:93-98` ⏸ |
| I3 | Docker depends_on: condition: service_healthy | app ждёт db и redis, db_backup ждёт db, redis_admin ждёт redis — порядок гарантирован | 🟢 | OK | `docker-compose.yml:30-34, 109-110, 133-135` ✅ |
| I4 | docker-compose сети | Все сервисы в одной сети liteend-net, bridge — изоляция норм | 🟢 | OK | `docker-compose.yml:137-139` ✅ |

## Каскадные сценарии

| # | Цепочка | В чём опасность | Риск | Решение | Файл |
|---|---------|-----------------|------|---------|------|
| X1 | 🔴 **Redis → Auth → Все запросы** | Redis тормозит → AuthService не может прочитать кеш `profile:sub:{sub}` (нет таймаута) → запросы входа зависают → Fastify таймаут (2 мин по умолчанию) → все GQL и REST, требующие JWT (кроме health), перестают отвечать | 🔴 | Добавить таймаут 2 сек на Redis-вызовы. Если Redis не отвечает — Auth работает напрямую с БД (без кеша) | `src/common/auth/auth.service.ts:14` ❌ |
| X2 | 🔴 **DB → Auth → FileUpload → Health** | PostgreSQL тормозит/недоступен → PRISMA connection timeout (10 сек) + пул занят → Auth не может найти профиль → все запросы падают с 500 | 🔴 | Statement timeout на Prisma-запросах + увеличить пул соединений | `src/common/prisma/prisma.service.ts:33, 40` ❌ |
| X3 | 🟠 **GQL subscriptions → Redis → Profile → Profile updates** | Redis падает → mqemitter-redis не доставляет подписки → пользователь не получает real-time обновления профиля + сброс кеша Profile не работает | 🟠 | Fallback emitter (in-process) + graceful degradation для Profile cache | `src/app.module.ts:48`, `src/modules/profile/profile.service.ts:24` ❌ |

## Итог

- **Парадигма:** Монолит (1 NestJS-процесс, Docker Compose)
- **Компонентов:** 12
- **Сценариев:** 30 (6 критических, 7 средних, остальные зелёные)
- **🔴/🟠:** 6

# Матрица — LiteEnd — 2026-05-21

## Архитектура: монолит (NestJS + Docker)

## Граф зависимостей

```
┌──────────────────────────────────────────────────────┐
│                    App (NestJS/Fastify)              │
│  ┌──────────┐  ┌───────────┐  ┌─────────────────┐   │
│  │Prisma ORM │  │  ioredis  │  │  BullMQ (queue) │   │
│  │(pg Pool)  │  │  (client) │  │  (test queue)   │   │
│  └─────┬─────┘  └─────┬─────┘  └────────┬────────┘   │
│        │              │                 │            │
│        │     ┌────────┘                 │            │
│        │     │      ┌───────────────────┘            │
│        │     │      │                                │
│        ▼     ▼      ▼                                │
│  ┌─────────────────────────────────────────────┐     │
│  │       GraphQL Subscriptions (mqemitter-redis)│     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌───────────────┐
   │PostgreSQL│  │  Redis   │  │   OIDC.Logto  │
   │:5432     │  │  :6379   │  │   (external)  │
   └──────────┘  └──────────┘  └───────────────┘
```

- **App** → **PostgreSQL** (Prisma ORM + @prisma/adapter-pg + pg Pool)
- **App** → **Redis** (ioredis — прямое подключение + бэкенд BullMQ + mqemitter-redis)
- **App** → **OIDC Provider** (Logto — внешний HTTP)
- **App** → **BullMQ** (очередь `test`, хранимая в Redis)

---

## Компонент: App

**Роль:** API Gateway + Бизнес-логика  
**Размещение:** Docker container (`node:lts-alpine`)  
**Порты:** `${PORT}` (default 4000), loopback only  
**Healthcheck:** `GET /health` — проверка БД (Prisma ping), Redis (PING), heap (< 150 MB), disk (< 90%)  
**Перезапуск:** `unless-stopped`  
**Пользователь:** `node` (non-root)

| #  | Сценарий                            | Что происходит                                                                                             | Риск  | Текущее поведение                                                                                                                            | Исправлено |
|----|--------------------------------------|------------------------------------------------------------------------------------------------------------|-------|----------------------------------------------------------------------------------------------------------------------------------------------|------------|
| A1 | **Недоступность БД**                | PostgreSQL недоступен (падение, сетевой сбой, перезагрузка)                                                | 🔴    | ❌ App не стартует (`depends_on: db: service_healthy`). Если БД падает после старта — все Prisma-запросы падают с ошибкой соединения. `PrismaService.$connect()` вызывается один раз в `onModuleInit`, reconnect отсутствует. `AllExceptionsFilter` превращает raw-ошибки в 500. Healthcheck сразу падает. | Нет      |
| A2 | **Недоступность Redis**             | Redis недоступен                                                                                           | 🔴    | ❌ App не стартует (`depends_on: redis: service_healthy`). Если Redis падает после старта — ioredis кидает `ECONNREFUSED` / `ETIMEDOUT`. `RedisService` не обрабатывает reconnect (ioredis по умолчанию пытается реконнект, но нет graceful fallback). BullMQ и GraphQL subscriptions ломаются каскадно. Healthcheck падает. | Нет      |
| A3 | **Redis reconnect / stall**         | Redis отвечает, но соединение нестабильно                                                                  | 🟡    | ❌ ioredis имеет встроенный reconnect (до 10 попыток с exponential backoff). Нет мониторинга stalled-соединений. BullMQ может терять jobs. Нет проверки `isOpen` перед операциями. | Нет      |
| A4 | **Недоступность OIDC (Logto)**      | Внешний OIDC-провайдер недоступен                                                                          | 🟠    | ❌ В production все запросы к защищённым эндпоинтам падают с 401/500. Нет кэширования JWKS, нет fallback/offline-mode. В dev режиме `OIDC_MOCK_ENABLED=true` обходит проблему. | Нет      |
| A5 | **Недоступность BullMQ (Redis)**    | Redis жив, но BullMQ не может подключиться/зарегистрировать очередь                                        | 🟡    | ❌ BullModule.forRootAsync использует те же host/port/password из Redis. Если Redis недоступен — BullModule не проинициализируется, что ломает модуль `TestQueueModule`. | Нет      |
| A6 | **Отказ диска (data volume)**       | Закончилось место на `./data/uploads`, `./data/logs`, `./data/database_backups`                           | 🟠    | ✅ Healthcheck мониторит диск (>90%). Но если диск переполнен — file uploads падают, Pino может не писать логи, db_backup падает. | Да       |
| A7 | **Утечка памяти / OOM**             | Потребление heap > 150 MB                                                                                  | 🟠    | ✅ Healthcheck мониторит heap (MemoryHealthIndicator). Fastify bodyLimit = 10MB. При превышении — рестарт контейнера (unless-stopped). | Да       |
| A8 | **График (rate limit exhaustion)**  | >100 запросов/мин (кроме `/studio`, `/board`)                                                              | 🟢    | ✅ @fastify/rate-limit с `max: 100, timeWindow: 1 min`. Allow-list для `/studio`, `/board`. При превышении — 429 Too Many Requests. | Да       |
| A9 | **Ошибка валидации (Zod)**          | Невалидные входные данные (REST/GraphQL)                                                                   | 🟢    | ✅ Глобальный `ZodValidationPipe`. `AllExceptionsFilter` форматирует ошибки как 400 Validation Failed с деталями. | Да       |
| A10| **Необработанное исключение**       | Любое исключение, не являющееся HttpException                                                               | 🟠    | ✅ `AllExceptionsFilter` ловит все (через `@Catch()`), логирует 500 с stack trace. Ответ: `{"error":"Internal Server Error","message":"An unexpected error occurred"}`. | Да       |
| A11| **Сбой healthcheck**                | Healthcheck не проходит (БД, Redis, память, диск)                                                          | 🟡    | ✅ Docker restart policy `unless-stopped`. Healthcheck с `start_period: 10s`, `interval: 5s`, `retries: 3`. После 3 неудач — контейнер перезапускается. | Да       |
| A12| **Сбой миграции Prisma**            | `npm run db:migrations:apply` fails (через `prestart:prod`)                                                | 🔴    | ❌ Если миграция не применилась — `start:prod` не запустится. Нет fallback, нет retry, нет автоматического отката. Приложение не стартует. | Нет      |
| A13| **Отсутствие .env в production**    | `NODE_ENV=production`, файл .env отсутствует                                                               | 🟢    | ✅ `ConfigModule.forRoot` с `ignoreEnvFile: true` в production. Переменные из окружения Docker. | Да       |
| A14| **GraphQL Subscription disconnect** | Клиент отключается от WebSocket-подписки                                                                   | 🟡    | ❌ mqemitter-redis настроен, но нет обработки `onDisconnect`, таймаутов, heartbeat. Подписка может висеть мёртвой. | Нет      |
| A15| **CORS misconfiguration**           | Разрешены все источники (`app.enableCors()` без опций)                                                     | 🟠    | ❌ `enableCors()` без аргументов — разрешает все origin'ы, методы, заголовки. В production риск. | Нет      |
| A16| **Нарушение безопасности Helmet**   | CSP, COEP, COOP, CORP — `false` отключены                                                                  | 🟠    | ❌ Helmet зарегистрирован, но contentSecurityPolicy, crossOriginEmbedderPolicy, crossOriginOpenerPolicy, crossOriginResourcePolicy отключены. Уязвимости XSS, clickjacking — нет CSP. | Нет      |
| A17| **Отказ db_backup**                 | Бэкап БД не создаётся (нет места, недоступна сеть)                                                         | 🟢    | ✅ db_backup — отдельный сервис с restart: unless-stopped. Ротация 20 копий. Компрессия. | Да       |
| A18| **Отказ OIDC JWKS rotation**        | Logto меняет JWKS, а app использует старый кэш                                                             | 🟡    | ❌ `OIDC_JWKS_URI` указан, но нет информации о кэшировании JWKS на стороне приложения. Если JWKS-провайдер недоступен при валидации токена — fallback отсутствует. | Нет      |
| A19| **Недоступность pgAdmin / redis-admin** | Вспомогательные сервисы (db_admin, redis_admin) падают                                                      | 🟢    | ✅ Админки не влияют на работу app. Перезапускаются через unless-stopped. | Да       |
| A20| **Job в очереди зависает**          | TestQueueProcessor падает во время `process()`                                                              | 🟡    | ❌ `TestQueueProcessor.process()` не обрабатывает ошибки. При исключении BullMQ повторяет job (по умолчанию 0 попыток). Нет onFailed/onComplete коллбэков. | Нет      |
| A21| **Unhandled Promise Rejection**     | Асинхронная ошибка вне try-catch                                                                           | 🟡    | ❌ В main.ts только `.catch` для `bootstrap()`, но нет глобального `process.on('unhandledRejection')`. Node.js может вывести warning, но в будущем это приведёт к crash. | Нет      |
| A22| **Fastify bodyLimit превышение**    | Запрос > 10MB (bodyLimit: 10485760)                                                                         | 🟢    | ✅ Fastify возвращает 413 Payload Too Large до обработки. | Да       |
| A23| **Healthcheck race condition**      | Healthcheck выполняется до полной инициализации Prisma/Redis                                                | 🟢    | ✅ `start_period: 10s` даёт фору перед первой проверкой. PrismaService.$connect() — await | Да       |
| A24| **Pino Logger failure**             | Невозможность писать логи (диск, пермишены)                                                                | 🟡    | ❌ Pino может упасть молча. В `main.ts` при старте — `console.error`. В рантайме — потеря логов. Нет buffer/fallback. | Нет      |
| A25| **Зависимость от git в билде**     | Dockerfile копирует `.git` для lefthook, потом удаляет                                                    | 🟢    | ✅ lefthook не запускается в production (NODE_ENV=production). Слой удаления `.git` уменьшает финальный образ. | Да       |

---

## Каскадные сценарии

| Сценарий | Первичный отказ | Каскад | Итог |
|----------|----------------|--------|------|
| C1 | Redis недоступен | BullMQ не работает → TestQueueModule не инициализирован → GraphQL subscriptions (mqemitter-redis) не работают → RedisService падает | App не стартует (depends_on) или работает с ограниченной функциональностью |
| C2 | PostgreSQL недоступен | Все Prisma-запросы падают → Healthcheck database: down → AllExceptionsFilter возвращает 500 | App не стартует или отдаёт 500 на все запросы с БД |
| C3 | OIDC Logto недоступен | AuthGuard не может верифицировать токен → Все защищённые endpoints возвращают 401 | App работает, но auth сломан; mock-режим (dev) обходит это |
| C4 | Диск полон (root) | Pino не пишет → File uploads не работают → db_backup не создаётся → Healthcheck storage: down | Degraded mode |
| C5 | Сбой миграции | Prisma schema не соответствует БД → Все запросы падают → App не стартует | App не запускается |

---

## Критические задачи

| #  | Задача                                                                  | Компонент     | Серьёзность | Описание                                                                                                                     |
|----|-------------------------------------------------------------------------|---------------|-------------|------------------------------------------------------------------------------------------------------------------------------|
| T1 | **Добавить reconnect к БД**                                             | PrismaService | 🔴 Critical | `$connect()` только на старте. При потере соединения Prisma не переподключается. Нужен retry с exponential backoff.          |
| T2 | **Добавить reconnect/graceful degradation для Redis**                   | RedisService  | 🔴 Critical | ioredis reconnect есть, но нет fallback, нет проверки доступности перед операциями. Нужен health-aware wrapper.               |
| T3 | **Добавить retry миграций**                                             | prestart:prod | 🟠 High      | Миграция падает → app не стартует. Нужен retry (3 попытки + таймаут).                                                        |
| T4 | **Настроить CORS явно**                                                 | App bootstrap | 🟠 High      | `enableCors()` без опций — все origins. Указать production origin.                                                           |
| T5 | **Включить CSP / COEP / COOP / CORP в Helmet**                         | App bootstrap | 🟠 High      | Отключены 4 директивы безопасности. Настроить для production.                                                                |
| T6 | **Добавить `process.on('unhandledRejection')`**                        | main.ts       | 🟡 Medium    | Исключить риск будущих крашей от unhandled promise rejections.                                                               |
| T7 | **Добавить JWKS-кэш с fallback для OIDC**                              | AuthModule    | 🟡 Medium    | Кэшировать JWKS + fallback на последний известный ключ при недоступности OIDC.                                               |
| T8 | **Добавить обработку ошибок в TestQueueProcessor**                     | Queue         | 🟡 Medium    | Нет try-catch в process(). Добавить логирование и onFailed.                                                                  |
| T9 | **Добавить heartbeat/disconnect-обработчик для GraphQL subscriptions** | GraphQL setup | 🟡 Medium    | mqemitter-redis без onDisconnect. Добавить таймаут и очистку.                                                                |
| T10| **Добавить fallback для Pino**                                          | Logger        | 🟠 High      | При отказе Pino — потери логов. Добавить буфер или консоль-аппендер.                                                         |
| T11| **Покрыть auth-эндпоинты rate limiter** (уже есть глобальный)           | —             | 🟢 Low       | Уже есть глобальный rate limit. Возможно, стоит уменьшить лимит для /graphql.                                                 |
| T12| **Документировать runbook аварийного восстановления**                   | —             | 🟡 Medium    | Нет инструкций: "что делать, если БД упала", "как восстановиться из бэкапа".                                                 |

---

## Легенда

- **Риск:** 🔴 Critical — прямые потери данных / полный отказ приложения; 🟠 High — отказ функциональности; 🟡 Medium — деградация; 🟢 Low — козметика/документация.
- **Статус:** ✅ — риск устранён / обработан; ❌ — риск не устранён; 🔶 — частично.
- **Текущее поведение:** описание того, что происходит сейчас при наступлении сценария.

---

*Дата аудита: 2026-05-21 18:30 MSK*
*Версия кодовой базы: git HEAD (`/home/dex/Документы/Work/liteend`)*

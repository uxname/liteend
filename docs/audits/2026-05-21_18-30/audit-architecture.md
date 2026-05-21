# Audit Report: Architecture — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| ARC-01 | Бизнес-логика вынесена из route handlers в service/domain слой | PASS | HIGH | `FileUploadController.uploadFile()` делегирует `FileUploadService.processFile()` и `saveMetadata()`; `ProfileResolver` делегирует `ProfileService.updateProfile()`; `HealthController` только оркестрирует health-индикаторы; `TestQueueResolver` только добавляет job в очередь. Во всех модулях контроллеры/резолверы тонкие. | — | — |
| ARC-02 | Presentation layer не взаимодействует с БД напрямую | FAIL | HIGH | **JwtAuthGuard** (src/common/auth/jwt-auth.guard.ts:41-42,51-62) напрямую вызывает `this.prisma.profile.findUnique()` и `this.prisma.profile.upsert()` — guard относится к presentation (request pipeline). **JwtStrategy** (src/common/auth/jwt.strategy.ts:50-56) вызывает `this.prisma.profile.upsert()` — strategy тоже presentation. **HealthController** (src/infrastructure/health/health.controller.ts:10) инжектит `PrismaService` напрямую и передаёт его в `PrismaHealthIndicator`. | Вынести DB-запросы из `JwtAuthGuard`/`JwtStrategy` в отдельный auth-сервис; заменить прямой импорт `PrismaService` в `HealthController` на прокси-индикатор. | Нет |
| ARC-03 | Нет circular dependencies между модулями | PASS | HIGH | `npx madge --circular --extensions ts src/` показал 4 циклические зависимости, все в `@generated/prisma/` — это сгенерированный Prisma клиентский код, неизбежно. В прикладных модулях (src/app/, src/common/, src/infrastructure/, src/modules/) циклических зависимостей нет. | — | — |
| ARC-04 | Нет god-объектов: файлы и классы имеют единственную ответственность | PASS | HIGH | Максимальные размеры: `all-exceptions-filter.ts` (165 строк) — единая ответственность (обработка исключений); `graphql/error-formatter.ts` (140 строк) — единая ответственность; `file-upload.service.ts` (119 строк) — загрузка файлов; `jwt-auth.guard.ts` (94 строки) — аутентификация. Ни один файл не превышает 200 строк. Классы сфокусированы. | — | — |
| ARC-05 | Конфигурация и env-переменные изолированы в config-модуле | WARN | MEDIUM | **Основные модули используют ConfigService корректно** (PrismaService, RedisService, GraphQLModule, BullModule). **Исключения с прямым `process.env`:** `src/common/logger/pino-config.ts:10-11` (NODE_ENV); `src/app.module.ts:101` (NODE_ENV для ignoreEnvFile — допустимо, т.к. это entry point); `src/common/dotenv-validator/dotenv-validator.service.ts:7` (NODE_ENV). **db-backup-tool/** (3 файла) полностью использует `process.env` напрямую — но это standalone-скрипты, не часть NestJS-приложения (приемлемо с оговоркой). | Вынести NODE_ENV-зависимость из `pino-config.ts` в параметр, получаемый через DI или ConfigService; решить, нужно ли интегрировать db-backup-tool в NestJS DI. | Нет |
| ARC-06 | Внешние зависимости инжектируются (DI), не импортируются напрямую | PASS | HIGH | Все NestJS-модули используют constructor injection: `PrismaService` (глобальный модуль), `RedisService` (через RedisModule), `ConfigService` (через ConfigModule), `Queue` (через @InjectQueue). Внешние библиотеки (fastify, bullmq, terminus) регистрируются через соответствующие NestJS-модули. | — | — |
| ARC-07 | Доменный слой не импортирует инфраструктурные модули | PASS | HIGH | `src/modules/profile/` и `src/modules/file-upload/` импортируют только из `@/common/` (shared слой) и `@/modules/`. Ни один файл из `src/modules/` не импортирует из `src/infrastructure/`. Инфраструктурные модули (`health`, `test-queue`) не импортируют из `modules/`. Все зависимости направлены "сверху вниз" (modules → common → external) корректно. | — | — |

## Audit Coverage

| Компонент | Файлы прочитаны | Статус |
|-----------|----------------|--------|
| src/app.module.ts | ✅ `app.module.ts` | Полностью |
| src/bootstrap/setup-app.ts | ✅ `setup-app.ts` | Полностью |
| src/common/auth/*.ts | ✅ 7 файлов | Полностью |
| src/common/prisma/*.ts | ✅ 2 файла | Полностью |
| src/common/all-exceptions-filter.ts | ✅ `all-exceptions-filter.ts` | Полностью |
| src/common/graphql/*.ts | ✅ 2 файла | Полностью |
| src/modules/file-upload/*.ts | ✅ 3 файла (без spec) | Полностью |
| src/modules/profile/*.ts | ✅ 6 файлов (включая types/) | Полностью |
| src/infrastructure/test-queue/*.ts | ✅ 3 файла (без spec) | Полностью |
| src/infrastructure/health/*.ts | ✅ 3 файла + indicators/ | Полностью |
| src/common/dotenv-validator/*.ts | ✅ 2 файла (без spec) | Полностью |
| src/main.ts | ✅ `main.ts` | Полностью |
| src/common/logger/*.ts | ✅ `pino-config.ts`, `logger.module.ts`, `gql-logging.interceptor.ts` | Выборочно |
| src/common/redis/*.ts | ✅ 2 файла | Полностью |
| src/db-backup-tool/*.ts | ✅ 3 файла | Для справки (standalone) |

## Резюме

- **PASS**: 5 проверок (ARC-01, ARC-03, ARC-04, ARC-06, ARC-07)
- **WARN**: 1 проверка (ARC-05 — прямой `process.env` в pino-config.ts и db-backup-tool)
- **FAIL**: 1 проверка (ARC-02 — presentation слой обращается к БД в `JwtAuthGuard`, `JwtStrategy`, `HealthController`)

### Ключевые проблемы

1. **ARC-02 (FAIL)**: `JwtAuthGuard` и `JwtStrategy` выполняют DB-запросы напрямую. Guard не должен знать о Prisma или БД — это ответственность сервисного слоя. Рекомендуется:
   - Создать `AuthService` с методами `findOrCreateProfile(oidcSub)` и `findProfileBySub(mockSub)`.
   - Внедрить `AuthService` в `JwtAuthGuard` и `JwtStrategy`.
   - `HealthController` должен получать `PrismaHealthIndicator` уже готовым, без необходимости инжектить `PrismaService`.

2. **ARC-05 (WARN)**: `pino-config.ts` читает `process.env.NODE_ENV` напрямую. Конфигурация логгера должна принимать окружение через DI (например, прокидывать из `ConfigService` при инициализации модуля).

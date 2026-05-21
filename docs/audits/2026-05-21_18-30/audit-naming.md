# Audit Report: Naming — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| NAM-01 | Соглашение об именовании соблюдается консистентно (camelCase/snake_case) | PASS | HIGH | Все файлы, классы, методы и переменные используют camelCase; константы используют UPPER_SNAKE_CASE; файлы используют kebab-case с точками (напр. `file-upload.service.ts`). Биом-форматирование обеспечивает консистентность. | Не требуется | — |
| NAM-02 | Имена переменных, функций и классов описывают назначение, не реализацию | WARN | MEDIUM | **Нарушения:** (1) `gql*` префикс в `GqlLoggingInterceptor`, `gqlErrorFormatter` — сокращение `gql` вместо `GraphQL`, что немного снижает читаемость. (2) `realIpFactory` (real-ip.decorator.ts) — декоратор называется `RealIp`, но экспортированная фабрика называется `realIpFactory`. Название избыточно (фабрика по контракту всегда фабрика). Рекомендуется назвать `resolveRealIp` или `getRealIp`. | (1) Принять как есть — `gql` широко используется в экосистеме GraphQL. (2) Переименовать `realIpFactory` → `resolveRealIp`. | Нет |
| NAM-03 | Boolean-переменные имеют предикативные имена (is/has/can/should) | PASS | HIGH | Проверены все булевы: `isMockEnabled`, `isNoisy404`, `isClientError`, `isMercuriusPersistedError`, `IS_DEV`, `IS_TEST`, `isSensitive`, `isIgnored`, `shouldCaptureBody`, `isValidFilePath`. Все следуют предикативному шаблону. | Не требуется | — |
| NAM-04 | Функции-читатели (get*/find*) не имеют side effects | FAIL | HIGH | **Нарушение:** `generatePaths` (file-upload.service.ts:94-118) — имя предполагает чистую генерацию путей, но метод также создаёт директорию на диске (сторона 106: `fs.mkdirSync(fullDir, { recursive: true })`). Это side effect, не очевидный из названия. **Также:** `getSafeFileInfo` (file-upload.service.ts:32) — обращается к файловой системе (`fs.existsSync`), что является side effect для функции с префиксом `get`. | (1) Переименовать `generatePaths` → `ensurePathsAndGenerate` или разбить на `generatePaths` (чистый) + `ensureDirectoryExists`. (2) `getSafeFileInfo` → `resolveSafeFileInfo` или `readSafeFileInfo`. | ✅ Да |
| NAM-05 | Magic numbers и magic strings заменены именованными константами | FAIL | HIGH | **Magic numbers:** (1) `100` (rate limit max) в `setup-app.ts:34` — не именован. (2) `1024` (compression threshold) в `setup-app.ts:44` — не именован. (3) `10485760` (bodyLimit = 10 MB) в `main.ts:14` — не именован. (4) `150 * 1024 * 1024` (150 MB heap threshold) в `health.controller.ts:30` — 150 не именовано (только комментарий). (5) `0.9` (disk threshold 90%) в `health.controller.ts:34` — не именован. (6) `1` (jit) в `app.module.ts:44` — магическое число вместо `true`. (7) `1000` (1s timeout) в `test-queue.processor.ts:14`. **Магические строки:** (8) `'1 minute'` (rate limit window) в `setup-app.ts:35`. (9) `'mock-oidc-sub'` продублирован 2 раза в `jwt-auth.guard.ts:52,54`. (10) `'unknown'` использован как fallback в `error-formatter.ts:22` и `file-upload.controller.ts:70`. (11) `'127.0.0.1'` в `real-ip.decorator.ts:28`. | Создать именованные константы для всех magic numbers и строк. Для `jit: 1` заменить на `jit: true`. Для `'mock-oidc-sub'` вынести в `MOCK_OIDC_SUB`. Для `'unknown'` и `'127.0.0.1'` вынести как `FALLBACK_REQUEST_ID` / `FALLBACK_IP`. | ✅ Да |
| NAM-06 | Утилитные модули не являются свалкой несвязанного кода | PASS | HIGH | Все модули имеют одну зону ответственности: `auth/` — аутентификация и авторизация, `prisma/` — Prisma клиент, `redis/` — Redis клиент, `logger/` — логирование, `graphql/` — форматирование GraphQL-ошибок, `real-ip/` — декоратор для IP, `all-exceptions-filter.ts` — единый exception filter. | Не требуется | — |
| NAM-07 | Ключевые сущности названы в соответствии с доменным глоссарием проекта | PASS | HIGH | Доменные имена согласованы: `Profile` (основная сущность пользователя), `ProfileRole` (роли ADMIN/USER), `Upload` (сущность файла из Prisma), `FileUpload*` (загрузка файлов), `TestQueue*` (тестовая очередь BullMQ), `Health*` (health checks). GraphQL-имена совпадают (`me`, `updateProfile`, `profileUpdated`). | Не требуется | — |

## Audit Coverage

### Проверенные файлы (все ключевые):

| Файл | Строк | Статус |
|------|-------|--------|
| `src/common/auth/auth.module.ts` | 11 | ✅ |
| `src/common/auth/current-user.decorator.ts` | 19 | ✅ |
| `src/common/auth/jwt-auth.guard.ts` | 94 | ✅ |
| `src/common/auth/jwt-optional-auth.guard.ts` | 13 | ✅ |
| `src/common/auth/jwt.strategy.ts` | 58 | ✅ |
| `src/common/auth/roles.decorator.ts` | 5 | ✅ |
| `src/common/auth/roles.guard.ts` | 34 | ✅ |
| `src/common/auth/current-user.decorator.spec.ts` | 76 | ✅ |
| `src/modules/file-upload/file-upload.controller.ts` | 93 | ✅ |
| `src/modules/file-upload/file-upload.service.ts` | 119 | ✅ |
| `src/modules/file-upload/file-upload.module.ts` | 12 | ✅ |
| `src/modules/profile/profile.resolver.ts` | 67 | ✅ |
| `src/modules/profile/profile.service.ts` | 18 | ✅ |
| `src/modules/profile/profile.module.ts` | 9 | ✅ |
| `src/modules/profile/types/profile.object-type.ts` | 21 | ✅ |
| `src/modules/profile/types/profile-update.input.ts` | 15 | ✅ |
| `src/modules/profile/types/profile-role.enum.ts` | 8 | ✅ |
| `src/bootstrap/setup-app.ts` | 61 | ✅ |
| `src/common/graphql/error-formatter.ts` | 140 | ✅ |
| `src/common/graphql/error-formatter.spec.ts` | 163 | ✅ |
| `src/common/prisma/prisma.service.ts` | 38 | ✅ |
| `src/common/prisma/prisma.module.ts` | 10 | ✅ |
| `src/infrastructure/test-queue/test-queue.module.ts` | 20 | ✅ |
| `src/infrastructure/test-queue/test-queue.processor.ts` | 19 | ✅ |
| `src/infrastructure/test-queue/test-queue.resolver.ts` | 19 | ✅ |
| `src/infrastructure/test-queue/test-queue.spec.ts` | 127 | ✅ |
| `src/infrastructure/health/health.controller.ts` | 38 | ✅ |
| `src/infrastructure/health/health.module.ts` | 12 | ✅ |
| `src/infrastructure/health/indicators/redis.health.ts` | 30 | ✅ |
| `src/main.ts` | 40 | ✅ |
| `src/app.module.ts` | 133 | ✅ |
| `src/app.controller.ts` | 11 | ✅ |
| `src/common/all-exceptions-filter.ts` | 165 | ✅ |
| `src/common/dotenv-validator/dotenv-validator.service.ts` | 55 | ✅ |
| `src/common/dotenv-validator/dotenv-validator.module.ts` | 8 | ✅ |
| `src/common/logger/logger.module.ts` | 9 | ✅ |
| `src/common/logger/pino-config.ts` | 200 | ✅ |
| `src/common/logger/gql-logging.interceptor.ts` | 136 | ✅ |
| `src/common/logger/gql-logging.interceptor.spec.ts` | 197 | ✅ |
| `src/common/real-ip/real-ip.decorator.ts` | 33 | ✅ |
| `src/common/real-ip/real-ip.decorator.spec.ts` | 62 | ✅ |
| `src/common/redis/redis.module.ts` | 10 | ✅ |
| `src/common/redis/redis.service.ts` | 27 | ✅ |
| `src/dev-tools/bull-board/bull-board.module.ts` | 76 | ✅ |
| `src/dev-tools/debug/debug.module.ts` | 9 | ✅ |
| `src/dev-tools/debug/debug.resolver.ts` | 117 | ✅ |
| `src/dev-tools/dev-launcher/dev-launcher.controller.ts` | 40 | ✅ |
| `src/dev-tools/dev-launcher/dev-launcher.module.ts` | 7 | ✅ |
| `src/dev-tools/dev-launcher/dev-launcher.view.ts` | 153 | ✅ |
| `src/dev-tools/dev-launcher/tools.ts` | 93 | ✅ |
| `src/dev-tools/logger-serve/logger-serve.controller.ts` | 148 | ✅ |
| `src/dev-tools/logger-serve/logger-serve.module.ts` | 8 | ✅ |
| `src/dev-tools/logger-serve/auth/auth.guard.ts` | 51 | ✅ |
| `src/dev-tools/logger-serve/auth/auth.guard.spec.ts` | 81 | ✅ |
| `src/dev-tools/prisma-studio/prisma-studio.controller.ts` | 56 | ✅ |
| `src/dev-tools/prisma-studio/prisma-studio.module.ts` | 22 | ✅ |
| `src/dev-tools/prisma-studio/prisma-studio.service.ts` | 106 | ✅ |

### Summary

| Check ID | Статус |
|----------|--------|
| NAM-01 | ✅ PASS |
| NAM-02 | ⚠️ WARN |
| NAM-03 | ✅ PASS |
| NAM-04 | ❌ FAIL |
| NAM-05 | ❌ FAIL |
| NAM-06 | ✅ PASS |
| NAM-07 | ✅ PASS |

**Итого:** 4 `PASS`, 1 `WARN`, 2 `FAIL`.

### Дополнительные замечания (out of checklist)

1. **Однобуквенные переменные:** В production-коде обнаружены:
   - `f` (file) в `file-upload.controller.ts:72`, `file-upload.service.ts:83`, `logger-serve.controller.ts:48` — рекомендуется заменить на `file`.
   - `i` (issue) в `error-formatter.ts:33,46` — малозначимо, можно оставить.
   - `v` (value) в `gql-logging.interceptor.ts:38,42,115` — общепринято в функциональных цепочках, можно оставить.
   - `s` в `gql-logging.interceptor.ts:122` — `some((s) => ...)`, borderline.

2. **Underscore-prefix misusage:** `_filepath` в `logger-serve.controller.ts:65` — параметр назван с префиксом `_` (сигнализирует «не используется»), но используется на строке 69. Рекомендуется переименовать в `filepath`.

3. **Задвоение конфигурации:** В `setup-app.ts` две строки `@ApiConsumes('multipart/form-data')` (строки 32 и 45) — дублирование декоратора.

4. **Вложенность в `dev-tools/logger-serve/auth/`** — для простого Basic Auth guard создана отдельная директория с модулем-обёрткой, что избыточно для одного файла. Guard мог бы лежать прямо в `logger-serve/`.

5. **`mock-oidc-sub`** — строка захардкожена дважды (create и where) в `jwt-auth.guard.ts`. При изменении одного места второе будет пропущено.

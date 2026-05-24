# Audit Report: Naming — 2026-05-22 11:43

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| NAM-01 | Соглашение об именовании соблюдается консистентно (camelCase/snake_case) | ❌ FAIL 🟢 | High | `src/modules/file-upload/file-upload.service.ts:17-19` | 1. **Переименовать `UPLOAD_DIR` → `uploadDir`, `DEFAULT_MIME_TYPE` → `defaultMimeType`, `ALLOWED_MIME_TYPES` → `allowedMimeTypes`** \\ 2. Оставить как есть — приватные поля класса, нейминг не влияет на API \\ 3. Вынести в module-level константы, если они не зависят от экземпляра | Да |
| NAM-02 | Имена переменных, функций и классов описывают назначение, не реализацию | ✅ PASS | High | `src/` — все имена описывают ЧТО делает функция (`findOrCreateProfile`, `getSafeFileInfo`), а не КАК (`redis.get()`) | — | — |
| NAM-03 | Boolean-переменные имеют предикативные имена (is/has/can/should) | ✅ PASS | High | `isMockEnabled`, `isNoisy404`, `isClientError`, `isExpired`, `isHealthy`, `isActive`, `isGitInstalled` — все boolean имеют предикативные префиксы | — | — |
| NAM-04 | Функции-читатели (get*/find*) не имеют side effects | ✅ PASS | High | `getClient()` — pure getter, `getMimeType()` — pure, `findProfileBySub()` — read-only. `findOrCreateProfile()` — создаёт, но имя это явно указывает | — | — |
| NAM-05 | Magic numbers и magic strings заменены именованными константами | ❌ FAIL 🟢 | High | `src/common/redis/redis.service.ts:21-24` — `connectTimeout: 10000`, `Math.min(times * 200, 3000)`; `src/common/prisma/prisma.service.ts:30-32` — `connectionTimeoutMillis: 10000`, `idleTimeoutMillis: 30000`, `max: 10`; `src/common/prisma/prisma.service.ts:51` — `attempt * 1000`, `5000`; `src/modules/file-upload/file-upload.service.ts:67` — `30_000`; `src/bootstrap/setup-app.ts:25` — `5 * 1024 * 1024`, `files: 10` | 1. **Вынести все magic numbers в именованные константы (например, `REDIS_CONNECT_TIMEOUT = 10000`, `DB_POOL_MAX = 10`)** \\ 2. Поместить в `src/common/constants.ts` или в конфиг-сервис \\ 3. Оставить с комментарием, задокументировать что число значит | Да (основные константы вынесены) |
| NAM-06 | Утилитные модули не являются свалкой несвязанного кода | ✅ PASS | High | В проекте нет `utils.ts` или `helpers.ts`. Каждый модуль сфокусирован: `constants.ts` — константы, `all-exceptions-filter.ts` — только фильтр, `pino-config.ts` — только конфиг pino | — | — |
| NAM-07 | Ключевые сущности названы в соответствии с доменным глоссарием проекта | ✅ PASS | Medium | `Profile`, `Upload`, `Auth` — консистентно во всех слоях. В Prisma схеме (`prisma/schema.prisma`) имена совпадают с кодом. Нет synonyms для одной сущности | — | — |

## Дополнительные наблюдения

### Enum naming (PascalCase + UPPER_CASE)
- `ProfileRole` в `src/modules/profile/types/profile-role.enum.ts:3` — PascalCase для enum, UPPER_CASE для значений (`ADMIN`, `USER`) ✅

### Interface/Type naming
- Все интерфейсы без I-префикса: `CommitInfo`, `JwtPayload`, `RequestWithUser`, `PinoCustomProps`, `DevTool`, `HttpExceptionResponse` — PascalCase ✅
- `CurrentUserType` использует `Type`-суффикс — консистентно ✅

### Abbreviations
- `req`, `res` — стандарт Fastify/Express ✅
- `oidcSub` — `oidc` общепринятая аббревиатура ✅
- `gql` — общепринято в экосистеме GraphQL ✅
- `ttlMs` — `ttl` понятна разработчикам ✅
- Криптических аббревиатур (`mgr`, `proc`, `srv`, `usr`) не обнаружено ✅

### File naming (kebab-case)
- Все файлы используют kebab-case: `profile.service.ts`, `profile-role.enum.ts`, `jwt-auth.guard.ts`, `all-exceptions-filter.ts`, `gql-logging.interceptor.ts` ✅

### Файлы spec
- Тест-файлы следуют конвенции `*.spec.ts` / `*.e2e.spec.ts` ✅

## Audit Coverage
- **Проверено**: `src/modules/`, `src/common/`, `src/infrastructure/`, `src/bootstrap/`, `src/dev-tools/`, `prisma/`, `test/`
- **Пропущено**: `src/@generated/` (автогенерация), миграции Prisma
- **Файлов проверено**: ~50 | **Пропущено**: ~5

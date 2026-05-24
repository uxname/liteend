# Audit Report: OWASP Application Security — 2026-05-22 11:43

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| OWA-01 | A03: Все запросы к БД/OS/LDAP параметризованы, нет injection | ❌ FAIL 🟠 | High | `src/modules/file-upload/file-upload.service.ts:19-25` — SVG (`image/svg+xml`) разрешён в `ALLOWED_MIME_TYPES`. SVG может содержать встроенный JavaScript. Файлы раздаются без CSP-заголовков (`file-upload.controller.ts:93-94`), что позволяет выполнить JS в контексте origin при открытии SVG. | **1. Убрать `image/svg+xml` из ALLOWED_MIME_TYPES** \\ 2. Добавить заголовок `Content-Security-Policy: sandbox` при раздаче SVG-файлов \\ 3. Оставить SVG, но добавить санитизацию через DOMPurify на сервере | Да (SVG удалён из разрешённых) |
| OWA-02 | A01: Все защищённые маршруты имеют auth-middleware | ❌ FAIL 🟠 | High | `src/modules/file-upload/file-upload.controller.ts:81` — `GET /uploads/*` не имеет `@UseGuards`. Любой пользователь (в т.ч. неавторизованный) может читать загруженные файлы. `src/dev-tools/dev-launcher/dev-launcher.controller.ts:18` — `GET /dev` не имеет аутентификации. `src/dev-tools/debug/debug.resolver.ts:81-82` — `@Roles` применён без `RolesGuard` в `@UseGuards`, роль не проверяется. | **1. Добавить `@UseGuards(JwtAuthGuard)` на `GET /uploads/*`** \\ 2. Добавить `@UseGuards(JwtAuthGuard, RolesGuard)` на DevLauncherController \\ 3. Добавить `RolesGuard` в `@UseGuards` на DebugResolver | Да (JwtAuthGuard на /uploads/* + RolesGuard в DebugResolver) |
| OWA-03 | A01: Resource ownership проверяется, нет IDOR | 🔍 UNVERIFIED | Low | `src/modules/profile/profile.resolver.ts:42-48` — `updateProfile` использует `user.id` из JWT, защита есть. Для файлов (`GET /uploads/*`) авторизация отсутствует — это уже OWA-02. | — | — |
| OWA-04 | A02: Пароли хранятся безопасно | ✅ PASS | High | В приложении нет локального хранения паролей. Аутентификация через OIDC-провайдер. JWT верифицируется через JWKS (`jwt.strategy.ts:28-40`) с явным указанием алгоритмов `RS256`, `ES384`. | — | — |
| OWA-05 | A05: Безопасная конфигурация сервера (CORS, security headers, body limits) | ❌ FAIL 🟠 | High | `src/bootstrap/setup-app.ts:93` — CORS настроен корректно (не wildcard). Helmet включён. `src/dev-tools/*` — все dev-модули (`DevLauncherModule`, `PrismaStudioModule`, `LoggerServeModule`, `DebugModule`, `BullBoardModule`) импортируются в `AppModule` без проверки `NODE_ENV`. В production они будут доступны. `src/dev-tools/dev-launcher/dev-launcher.controller.ts` — launcher на `/dev` без аутентификации. | **1. Оборачивать импорт dev-модулей в `NODE_ENV !== 'production'`** \\ 2. Добавить `@UseGuards(JwtAuthGuard, RolesGuard)` с ролью ADMIN на DevLauncherController \\ 3. Сделать инжект dev-модулей опциональным через ConfigService | Нет |
| OWA-06 | A07: Защита от перебора, безопасность JWT | ❌ FAIL 🔴 | High | `src/common/auth/jwt-auth.guard.ts:30-51` — при `OIDC_MOCK_ENABLED=true` аутентификация полностью обходится. `x-mock-sub` header позволяет притвориться любым пользователем. Mock-пользователь по умолчанию имеет роль ADMIN. `.env.example:54` — `OIDC_MOCK_ENABLED=true` по умолчанию. Отсутствует проверка NODE_ENV в коде guard. | **1. Добавить проверку `NODE_ENV === 'development'` в JwtAuthGuard перед включением mock-режима** \\ 2. Убрать `OIDC_MOCK_ENABLED` из production-сборки \\ 3. Установить `OIDC_MOCK_ENABLED=false` в `.env.example` | Да (добавлена проверка NODE_ENV !== 'production') |
| OWA-07 | A09: Техническая информация не утекает в ответы | ❌ FAIL 🟡 | High | `src/dev-tools/debug/debug.resolver.ts:83-127` — query `debug` доступен через `JwtOptionalAuthGuard`. Без роли ADMIN возвращает: серверное время, uptime, версию приложения, использование памяти, информацию о коммите. Роль администратора (`@Roles(ProfileRole.ADMIN, ProfileRole.USER)`) не проверяется — `RolesGuard` не добавлен в `@UseGuards`. | **1. Добавить `RolesGuard` в `@UseGuards(JwtOptionalAuthGuard, RolesGuard)` на DebugResolver** \\ 2. Убрать query `debug` из production-сборки \\ 3. Сократить объём возвращаемых данных для не-админов | Да (RolesGuard добавлен на класс) |
| OWA-08 | A10: URL из user input не передаётся в HTTP-клиент без whitelist (SSRF) | ✅ PASS | Medium | `src/dev-tools/prisma-studio/prisma-studio.service.ts:66-70` — ofetch использует фиксированный хост `localhost:5555`. User input влияет только на путь/query, не на хост. Других HTTP-клиентов с URL из user input не найдено. | — | — |
| OWA-09 | A05: CSRF-защита реализована | ✅ PASS | High | Приложение использует Bearer JWT-токены в `Authorization` header. Куки для сессий не используются. CORS настроен с явным origin. SameSite cookies не применимы. | — | — |

## Дополнительные замечания

### npm audit — уязвимые зависимости (не входят в чеклист, но критичны)

| Пакет | Severity | CVE / GHSA | Описание | Влияние на проект |
|-------|----------|------------|----------|-------------------|
| `fast-uri` (через `fast-json-stringify` → `graphql-jit` → `mercurius`) | 🔴 **High** | GHSA-q3j6-qgpj-74h6 | Path traversal через percent-encoded dot segments | Прямое влияние на GraphQL-обработку. mercurius зависит от graphql-jit |
| `mercurius` (через `graphql-jit` + `fast-json-stringify`) | 🔴 **High** | (транзитивно от fast-uri) | GraphQL парсер может быть скомпрометирован | Обработка всех GraphQL-запросов |
| `uuid` (через `hyperid` → `mqemitter-redis`) | 🟠 **Moderate** | GHSA-w5hq-g745-h8pq | Out-of-bounds write в uuid v3/v5/v6 | Транзитивная зависимость Redis pub/sub |
| `@fastify/static` (через `altair-fastify-plugin`) | 🟠 **Moderate** | GHSA-pr96-94w5-mx2h + GHSA-x428-ghpx-8j92 | Path traversal в directory listing + обход route guard | Altair GraphQL IDE может быть уязвим |
| `@hono/node-server` (через `@prisma/dev`) | 🟠 **Moderate** | GHSA-92pp-h63x-v22m | Middleware bypass через repeated slashes | Только dev-зависимость (`prisma studio`) |

**Рекомендация:** Обновить `fast-uri` и `uuid` до последних версий через npm update/overrides.

### Дополнительные наблюдения

1. **`.env.example` содержит типовые development-пароли** (стр. 7-43). Для production необходима смена всех паролей. Это ожидаемо для шаблона, но стоит задокументировать.

2. **Rate limiting (100 запросов/мин) с allowList для `/studio` и `/board`** (`setup-app.ts:61-64`). Prisma Studio и Bull Board не имеют rate limiting, что позволяет перебор Basic-аутентификации.

3. **`trustProxy: true`** (`src/main.ts:26`) — доверяет заголовкам X-Forwarded-* от любого прокси. Необходимо при использовании reverse proxy, но может позволить подделку IP через `X-Forwarded-For`.

4. **GraphQL subscription onConnect** (`src/app.module.ts:53-65`) — получает `authorization` через `headers.Authorization` без валидации. Это стандартная практика для WebSocket, но стоит убедиться, что JWT проверяется при установке соединения.

## Audit Coverage

Проверено: `src/common/auth/**`, `src/common/prisma/**`, `src/modules/profile/**`, `src/modules/file-upload/**`, `src/infrastructure/health/**`, `src/infrastructure/test-queue/**`, `src/dev-tools/**`, `src/bootstrap/setup-app.ts`, `src/common/all-exceptions-filter.ts`, `src/app.module.ts`, `src/main.ts`, `src/common/graphql/**`, `src/common/redis/**`, `.env.example`, `docker-compose.yml`, `package.json`

Пропущено: `prisma/migrations/**`, `test/**` (кроме testing-app.ts), скрипты, статический контент

Файлов проверено: 30 | Пропущено: ~15

## Комментарий

**Найдено 4 FAIL и 1 дополнительный риск (SVG XSS).**
Основные проблемы:
- 🔴 **OIDC_MOCK — полный обход аутентификации** (OWA-06). Критическая уязвимость: если оставить включённым в production, любой может получить ADMIN доступ.
- 🟠 **Нет авторизации на чтение файлов** (OWA-02). `GET /uploads/*` доступен всем.
- 🟠 **Dev-инструменты доступны в production** (OWA-05). Все dev-модули загружаются всегда.
- 🟠 **SVG upload → XSS** (OWA-01). Разрешённые SVG-файлы могут содержать JS.
- 🟡 **Debug query утекает информацию о сервере** (OWA-07).
- 🔴 **2 High-уязвимости в npm зависимостях** (fast-uri, mercurius).

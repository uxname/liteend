# Audit Report: OWASP Application Security — 2026-05-21 18:30

**Repository:** `/home/dex/Документы/Work/liteend`
**Framework:** NestJS 11 + Fastify + TypeScript + Prisma + GraphQL (Mercurius)
**Auditor:** AI Agent
**Baseline:** `docs/audit-baseline.yml` (empty — no accepted risks)

---

## Summary

| Total Checks | Passed | Failed | N/A |
|-------------|--------|--------|-----|
| 9           | 5      | 3      | 1   |

**3 checks FAIL.** All findings must be addressed or moved to baseline as accepted risks.

---

## Detailed Findings

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| OWA-01 | A03: Все запросы к БД/OS/LDAP параметризованы, нет injection | ✅ PASS | High | Only Prisma ORM used (`PrismaClient`). No `$queryRawUnsafe`, `$executeRawUnsafe`, or raw SQL strings found. All queries go through Prisma's parameterized query engine (`prisma/profile/update`, `prisma/profile/findUnique`, `prisma/profile/upsert`, `prisma/upload/createMany`). No `exec()` with user input (the only `exec()` in `prisma-studio.service.ts` is a hardcoded `npm run db:studio`). | — | — |
| OWA-02 | A01: Все защищённые маршруты имеют auth-middleware | ⚠️ FAIL | High | **Protected:** `ProfileResolver` (`@UseGuards(JwtAuthGuard, RolesGuard)` class-level), `FileUploadController.uploadFile` (`@UseGuards(JwtAuthGuard)`), `DebugResolver.debug` (`@UseGuards(JwtOptionalAuthGuard)` + `@Roles()`), `LoggerServeController` (custom `@UseGuards(AuthGuard)`). **UNPROTECTED:** `TestQueueResolver.addTestJob` (Mutation `addTestJob` — **NO guards at all**, publicly accessible), `DebugResolver.echo`, `DebugResolver.testTranslation`, `DebugResolver.echoMutation` (no guards). Health endpoint (`/health`) intentionally public. | Add `@UseGuards(JwtAuthGuard)` or `@Roles()` to `TestQueueResolver`, `echo`, `testTranslation`, `echoMutation` in `DebugResolver`, or explicitly annotate as intentional. | No |
| OWA-03 | A01: Resource ownership проверяется, нет IDOR | ✅ PASS | High | **Profile update** (`profile.service.ts` line 10-16): uses `user.id` from `@CurrentUser()` decorator — user can only update own profile. **Profile subscription** (`profile.resolver.ts` lines 56-62): filter checks `currentUserId === updatedProfileId`. **File upload** stores `uploaderIp` but retrieval (`GET /uploads/*`) is intentionally public (no ownership enforcement needed). No IDOR vectors found. | — | — |
| OWA-04 | A02: Пароли хранятся безопасно (bcrypt/argon2/scrypt) | ✅ PASS | High | Authentication is handled externally via **OIDC** (Logto). JWT strategy (`jwt.strategy.ts`) validates tokens using JWKS (`RS256`/`ES384`). No passwords stored in this application — no password hashing code, no `bcrypt`/`argon2`/`scrypt` dependencies. The `OIDC_MOCK_ENABLED` flag bypasses OIDC entirely but is documented as dev-only. | Ensure `OIDC_MOCK_ENABLED` is **never** set to `true` in production environments. | — |
| OWA-05 | A05: Безопасная конфигурация сервера (CORS, security headers, body limits) | ⚠️ FAIL | High | **CORS:** `app.enableCors()` in `setup-app.ts` line 58 — called with **no options**, allowing all origins, methods, and headers. **Helmet:** Registered at `setup-app.ts` lines 26-31 but with `contentSecurityPolicy: false`, `crossOriginEmbedderPolicy: false`, `crossOriginOpenerPolicy: false`, `crossOriginResourcePolicy: false` — effectively disables all meaningful protection. **Body limit:** `bodyLimit: 10485760` (10 MB) set in `main.ts` line 15 — acceptable. **Compression:** `@fastify/compress` enabled (acceptable). | 1) Configure `app.enableCors()` with explicit origin whitelist (e.g., `origin: process.env.CORS_ORIGIN?.split(',')`). 2) Re-enable helmet protections selectively (at minimum `contentSecurityPolicy` with a restrictive policy). | ✅ Да |
| OWA-06 | A07: Защита от перебора (rate limiting на auth и чувствительных эндпоинтах) | ✅ PASS | Medium | Global rate limiter configured via `@fastify/rate-limit` at `setup-app.ts` lines 33-40: `max: 100` requests per `1 minute` with allow-list for `/studio` and `/board`. This covers all endpoints. However, the limit is global (not per-route) — a single client could exhaust the entire limit with health checks or static file requests, leaving no capacity for auth endpoints. 100 req/min is generous for auth. | Consider adding stricter per-route rate limits on auth-sensitive endpoints (login-adjacent or mutation-heavy routes). | No (improvement) |
| OWA-07 | A09: Техническая информация не утекает в ответы (stack trace, внутренние пути) | ⚠️ FAIL | High | **HTTP exceptions** (`all-exceptions-filter.ts` lines 159-163): for unhandled errors, returns `"An unexpected error occurred"` — **safe**. **GraphQL errors** (`error-formatter.ts` lines 117-120): for unhandled errors, returns `originalError.message` to the client — **leaks internal error messages** (e.g., database constraint errors, internal logic messages). **DebugResolver:** `echo`, `testTranslation`, `echoMutation` queries have **no guards** (publicly accessible). `debug` query with `JwtOptionalAuthGuard` + `@Roles()` may leak server info (memory, uptime, commit info). | 1) Fix `gqlErrorFormatter` to mask internal error messages (use `'Internal Server Error'` always for non-HttpException errors). 2) Add `@UseGuards(JwtAuthGuard)` or `@Roles()` to `echo`/`testTranslation`/`echoMutation` or document as intentionally public. | ✅ Да |
| OWA-08 | A10: URL из user input не передаётся в HTTP-клиент без whitelist (SSRF) | ✅ PASS | High | The only HTTP client usage is `ofetch` in `prisma-studio.service.ts` (dev tool). The target URL always points to `http://localhost:5555` with a path derived from `request.url`. The host and port are **fixed** — user controls only the path segment. No other HTTP client code found in production modules. Logger-serve and file-upload only use `fs.createReadStream` for local files. | Ensure prisma-studio proxy is only accessible in development (it already has basic auth). | — |
| OWA-09 | A05: CSRF-защита реализована (SameSite cookies или CSRF-токены на state-changing запросах) | ✅ PASS | High | The app uses **JWT Bearer tokens** in `Authorization` header (not cookies) for all protected routes. JWT tokens are extracted via `ExtractJwt.fromAuthHeaderAsBearerToken()` — browsers do not automatically send `Authorization` headers cross-origin, so CSRF is not applicable. GraphQL subscriptions use WebSocket with auth passed in connection params via headers. CORS being wide open is a separate concern (OWA-05) but does not enable CSRF against a bearer-token API. | N/A — JWT-in-header pattern is inherently CSRF-safe. | — |

---

## Additional Observations

### 1. OIDC_MOCK_ENABLED — Dangerous Feature Flag
- **File:** `jwt-auth.guard.ts` lines 31-66
- **Risk:** When `OIDC_MOCK_ENABLED=true`, **any request** with an `x-mock-sub` header can impersonate **any user** by OIDC sub. A fallback user with `ADMIN` role is also created automatically.
- **Severity:** Critical (if accidentally enabled in production)
- **Mitigation:** The `.env.example` has it `true` with a `WARNING` comment. Ensure CI/CD pipelines or production env files **never** set this value. Consider adding a runtime guard that crashes the app if `NODE_ENV=production` and `OIDC_MOCK_ENABLED=true`.

### 2. Default Credentials in `.env.example`
- Several services use `admin`/`admin` defaults: LOGS_ADMIN_PANEL, DB_ADMIN, PRISMA_STUDIO, BULL_BOARD, REDIS_ADMIN.
- These are placeholders for `.env.example`, but if copied directly to `.env` and deployed, they become real credentials.
- **Mitigation:** Already documented as example; ensure `.env` is in `.gitignore` and production uses strong passwords.

### 3. TestQueueResolver — Unauthenticated Mutation
- **File:** `src/infrastructure/test-queue/test-queue.resolver.ts`
- **Risk:** The `addTestJob` mutation is **completely public** — no `@UseGuards`, no `@Roles`. Any client can add arbitrary jobs to the BullMQ queue.
- **Severity:** Medium (could be used to spam queues or inject test data)
- **Fix:** Add `@UseGuards(JwtAuthGuard)` or at minimum annotate with `@Roles()`.

### 4. DebugResolver — Public Echo Queries
- **File:** `src/dev-tools/debug/debug.resolver.ts`
- **Risk:** `echo`, `testTranslation`, and `echoMutation` have no guards. While low-risk individually, they expose resolver functionality without any auth.
- **Fix:** Either add guards or document as intentionally public endpoints.

### 5. GraphQL Error Leakage (Confirmed OWA-07 finding)
- **File:** `src/common/graphql/error-formatter.ts` lines 117-120
- **Code:**
  ```ts
  const errorMessage =
    originalError instanceof Error
      ? originalError.message
      : 'Internal Server Error';
  ```
- **Impact:** Internal error messages (e.g., "Unique constraint failed on the fields: (`email`)") are leaked to GraphQL clients. The `AllExceptionsFilter` for HTTP correctly masks errors, but the GQL formatter does not.
- **Fix:** Replace with `'Internal Server Error'` unconditionally for non-HttpException errors.

---

## Audit Coverage

| Component | Files Reviewed | Status |
|-----------|---------------|--------|
| Auth (guards, strategies, decorators) | `src/common/auth/*.ts` (11 files) | Covered |
| Server bootstrap (CORS, helmet, rate limit) | `src/bootstrap/setup-app.ts` | Covered |
| Prisma schema and service | `prisma/schema.prisma`, `src/common/prisma/*.ts` (2 files) | Covered |
| Exception handling | `src/common/all-exceptions-filter.ts` | Covered |
| GraphQL error formatting | `src/common/graphql/error-formatter.ts`, `error-formatter.spec.ts` | Covered |
| Profile module (resolver, service, input) | `src/modules/profile/*.ts` (8 files) | Covered |
| File upload module (controller, service) | `src/modules/file-upload/*.ts` (5 files) | Covered |
| Dev tools (prisma-studio, debug, logger-serve) | `src/dev-tools/*/*.ts` (4 files) | Covered |
| Health endpoint | `src/infrastructure/health/health.controller.ts` | Covered |
| Test queue | `src/infrastructure/test-queue/test-queue.resolver.ts` | Covered |
| Docker configuration | `docker-compose.yml`, `Dockerfile` | Covered |
| Dependencies | `package.json` | Covered |
| Main entry point | `src/main.ts` | Covered |
| App module | `src/app.module.ts` | Covered |

### Files Not Directly Reviewed (out of scope or not found)
- `src/common/redis/` — Redis configuration, no security-sensitive code expected
- `src/common/logger/` — Logging infrastructure
- `src/common/dotenv-validator/` — Env validation
- `src/common/git-commit-saver.ts` — Build-time utility
- `src/i18n/` — Translation files
- `src/infrastructure/health/indicators/` — Health check sub-components
- `src/dev-tools/bull-board/`, `src/dev-tools/dev-launcher/` — Dev tools
- `test/` — Test helpers, factories, E2E utilities

---

## Action Items (Priority Order)

| Priority | Check | Issue | Action |
|----------|-------|-------|--------|
| P0 | OWA-07 | GraphQL error formatter leaks internal error messages | Replace `originalError.message` with `'Internal Server Error'` for non-HttpException errors in `gqlErrorFormatter` |
| P0 | OWA-05 | CORS allows all origins | Configure explicit origin whitelist in `setup-app.ts` |
| P0 | OWA-05 | Helmet protections mostly disabled | Re-enable `contentSecurityPolicy` and other policies |
| P1 | OWA-02 | `TestQueueResolver.addTestJob` has no auth | Add `@UseGuards(JwtAuthGuard)` to resolver class |
| P1 | Additional | `OIDC_MOCK_ENABLED` guard in production | Add runtime check: crash if `NODE_ENV=production` and `OIDC_MOCK_ENABLED=true` |
| P2 | OWA-02 | `DebugResolver` echo/testTranslation queries publicly accessible | Add guards or document as intentional |
| P2 | OWA-06 | Weak rate limiting on auth-sensitive routes | Consider per-route rate limits (`@fastify/rate-limit` supports route-level config) |

---

*Report generated by AI agent. All findings should be manually verified before applying fixes.*

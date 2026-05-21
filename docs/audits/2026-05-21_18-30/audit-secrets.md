# Audit Report: Secrets Leak — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| SEC-01 | Нет hardcoded credentials в коде (пароли, токены, API-ключи, приватные ключи) | ❌ FAIL 🟠 | High | `prisma.config.ts:20`: hardcoded fallback `postgresql://postgres:postgres@localhost:5432/postgres?schema=public` с реальными кредами (user=postgres, password=postgres). | **Удалить хардкод: заменить fallback на `env('DATABASE_URL') ?? undefined` с явной ошибкой при отсутствии** \\ Изменить на `throw new Error('DATABASE_URL or individual DB env vars must be set')` вместо fallback-строки \\ Вынести fallback-строку в .env.example и использовать только env-переменные | Нет |
| SEC-02 | Файлы с секретами исключены из VCS (.env* в .gitignore) | ❌ FAIL 🟡 | High | `.gitignore` (строка 37) содержит только `.env`, но не `.env.*`. Файлы `.env.local`, `.env.production`, `.env.development` НЕ исключены и будут отслеживаться git. `git ls-files` подтверждает, что `.env` не индексирован, но `.env.*` не защищены. | **Добавить `.env.*` в `.gitignore` (или `.env.local`, `.env.production`, `.env.development`)** \\ Добавить `.env*.local` по шаблону 12-factor app \\ Использовать `git check-ignore` после изменений для верификации | Нет |
| SEC-03 | Секреты не передаются через URL (query params, Basic Auth в URL) | ✅ PASS | High | Ни в одном исходном файле не найдено URL с встроенными credentials. `prisma.config.ts` конструирует URL из env-переменных, что является лучшей практикой. В коде не найдено паттернов `https?://user:pass@`. | — | — |
| SEC-04 | .env.example содержит только placeholder-значения без реальных данных | ❌ FAIL 🟡 | High | `.env.example` содержит реальные OIDC credentials: `OIDC_ISSUER=https://oalmxx.logto.app/oidc` (реальный URL Logto), `OIDC_AUDIENCE=sl51b8k688hfuw9it0dqz` (реальный Client ID), `OIDC_JWKS_URI=https://oalmxx.logto.app/oidc/jwks`. Должны быть заглушки вида `http://localhost:3001/oidc` (как в реальном `.env`). | **Заменить все OIDC-значения на placeholder'ы: `OIDC_ISSUER=http://localhost:3001/oidc`, `OIDC_AUDIENCE=your-client-id`, `OIDC_JWKS_URI=http://localhost:3001/oidc/jwks`** \\ Удалить секцию OIDC из .env.example и добавить комментарий "см. документацию" \\ Верифицировать, что Logto credentials не закоммичены в git history (использовать BFG Repo-Cleaner если нужно) | Нет |
| SEC-05 | Dockerfile не содержит секретов в ENV-директивах | ✅ PASS | High | Dockerfile (строка 18): `ENV NODE_ENV=production` — единственная ENV-директива, не содержит credentials. Все секреты передаются через `.env` файл и env_file в docker-compose.yml. | — | — |
| SEC-06 | Комментарии в коде не содержат credentials | ✅ PASS | High | Все комментарии проверены в критических файлах: `src/common/auth/`, `src/bootstrap/`, `src/common/all-exceptions-filter.ts`, `src/common/prisma/`, `src/common/graphql/`, `src/modules/`. Ни один комментарий не содержит credentials, токенов, паролей или API-ключей. | — | — |
| SEC-07 | Автоматическое сканирование секретов настроено (pre-commit или CI) | ❌ FAIL 🔴 | High | `lefthook.yml` содержит только `npm run check` (type check + lint + knip) и `npm run test:all`. Нет секьюрити-сканера секретов. Директория `.github/` отсутствует — нет CI/CD пайплайна. В `package.json` нет зависимостей для сканирования секретов (gitleaks, trufflehog, git-secrets, secretlint, detect-secrets). | **Добавить pre-commit hook с gitleaks: `brew install gitleaks && gitleaks detect --report-format json --report-path gitleaks-report.json`** \\ Добавить `lefthook.yml` hook: `secrets-scan: run: npx @secretlint/secretlint **/*` \\ Добавить GitHub Action `.github/workflows/secret-scan.yml` с gitleaks в CI | Нет |

## Audit Coverage

**Проверено (critical paths):**
- `src/common/auth/**` — jwt.strategy.ts, auth.module.ts, guards, decorators
- `src/common/prisma/**` — prisma.service.ts, prisma.module.ts
- `src/common/all-exceptions-filter.ts`
- `src/bootstrap/setup-app.ts`
- `src/common/graphql/**` — error-formatter.ts
- `src/common/logger/**` — pino-config.ts, gql-logging.interceptor.ts
- `src/common/dotenv-validator/**`
- `src/modules/profile/**`
- `src/modules/file-upload/**`
- `src/dev-tools/**` — bull-board, prisma-studio, logger-serve, dev-launcher
- `src/infrastructure/**` — health, test-queue
- `src/app.module.ts`, `src/main.ts`, `prisma.config.ts`
- Конфигурационные файлы: `.gitignore`, `.env.example`, `.env`, `Dockerfile`, `docker-compose.yml`, `package.json`, `lefthook.yml`

**Пропущено:**
- `test/**` (содержит только тестовые данные-заглушки, не продакшн-секреты)
- `prisma/migrations/**` (генерация схемы, не содержит credentials)
- `src/i18n/**` (файлы переводов, не содержат секретов)
- `src/@generated/**` (автогенерация, gitignored)
- `node_modules/`, `dist/`, `data/`, `.git/`

**Файлов проверено:** 88 source .ts файлов + 7 конфигурационных файлов | Всего .ts файлов в репозитории: 172 (включая тесты и сгенерённые)

## Итог

| Статус | Кол-во |
|--------|--------|
| ✅ PASS | 3 |
| ❌ FAIL 🔴 | 1 (SEC-07) |
| ❌ FAIL 🟠 | 1 (SEC-01) |
| ❌ FAIL 🟡 | 2 (SEC-02, SEC-04) |
| ❌ FAIL 🟢 | 0 |
| ⏸ ACCEPTED | 0 |
| 🔍 UNVERIFIED | 0 |

**Критические находки:**
1. **SEC-07 (🔴):** Полное отсутствие автоматического сканирования секретов — ни pre-commit, ни CI. Наибольший риск.
2. **SEC-01 (🟠):** Hardcoded database credentials в `prisma.config.ts` — хотя и для локальной разработки, может случайно попасть в production-сборку.
3. **SEC-02 (🟡):** `.gitignore` не защищает `.env.*` варианты — риск утечки `.env.production` или `.env.development`.
4. **SEC-04 (🟡):** `.env.example` содержит реальные OIDC credentials — необходимо заменить на placeholder'ы.

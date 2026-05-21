# Audit Report: Build & Deployment — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|---------------|---------|-----------|
| DEP-01 | Dockerfile использует multi-stage build и не запускается от root | FAIL | HIGH | Dockerfile строка 1: `FROM node:lts-alpine` — один stage, без multi-stage. Строка 16: `USER node` — переключение на non-root есть. | Использовать multi-stage build: первый stage для установки dev-зависимостей и сборки, второй (scratch/alpine) только с production-зависимостями и собранным артефактом. | Нет |
| DEP-02 | docker-compose.yml не содержит hardcoded credentials | PASS | HIGH | Все credentials передаются через переменные `${VAR}` из env_file: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD`, `REDIS_PASSWORD`, `HTTP_USER`, `HTTP_PASSWORD`, `DB_ADMIN_EMAIL`, `DB_ADMIN_PASSWORD`, `REDIS_ADMIN_USER`, `REDIS_ADMIN_PASSWORD`. Жёстко закодированных секретов нет. | — | Не требуется |
| DEP-03 | Healthcheck настроен для всех сервисов | PARTIAL | HIGH | **app**: есть (строка 35-40), через `/app/healthcheck.sh`. **db**: есть (строка 57-61), `pg_isready`. **redis**: есть (строка 90-94), `redis-cli ping`. **db_admin** (pgadmin4): **НЕТ**. **redis_admin**: **НЕТ**. **db_backup**: **НЕТ**. | Добавить healthcheck для db_admin, redis_admin и db_backup. Например: `pg_isready` для pgadmin (через curl), `wget -O- http://localhost:8081` для redis-commander. | Нет |
| DEP-04 | Переменные окружения валидируются при старте (не падает в runtime) | PARTIAL | MEDIUM | `DotenvValidatorService` (dotenv-validator.service.ts строка 7-9) **полностью пропускает валидацию в production** (`if (process.env.NODE_ENV === 'production') return;`). В development/test проверяет только соответствие ключей между `.env` и `.env.example`, **но не типы/форматы значений**. `ConfigModule.forRoot` (app.module.ts строка 99-103) игнорирует env-файлы в production. `configService.getOrThrow()` ловит отсутствующие переменные, но это падение в runtime. В `backup.ts` (строка 23-37) используются `||` fallback на жёстко закодированные значения, маскируя ошибки конфигурации. | 1) Включить DotenvValidatorService в production или перенести проверку в отдельный bootstrap-validatior. 2) Использовать Zod-схему для валидации всех обязательных переменных при старте. 3) В backup.ts заменить `||` на `process.env.X ?? throw new Error(...)`. | Нет |
| DEP-05 | Production-образ не содержит dev-зависимостей и инструментов | FAIL | HIGH | Dockerfile строка 8: `npm i` (не `npm ci --production`), устанавливает **все** зависимости, включая devDependencies (typescript, tsx, prisma, vitest, biome, knip, lefthook и т.д.). Строка 2: установлены `python3 git openssl` — git нужен для lefthook, но это dev-инструмент. Строка 18: `ENV NODE_ENV=production` устанавливается **после** npm install, поэтому не влияет на исключение dev-зависимостей. | Использовать multi-stage build: stage 1 с devDependencies для сборки, stage 2 только с `npm ci --production` или копированием `dist/` и production node_modules. Удалить `git` и `python3` из финального образа. | Нет |
| DEP-06 | Секреты не передаются через Dockerfile ENV | PASS | HIGH | Единственная инструкция ENV в Dockerfile (строка 18): `ENV NODE_ENV=production` — не является секретом. Все секреты передаются через `env_file: .env` в docker-compose.yml и через `environment:` с подстановкой `${VAR}`. `npm run start:prod` задаёт `NODE_ENV` через cross-env в package.json. | — | Не требуется |
| DEP-07 | Graceful shutdown настроен для всех контейнеров | PARTIAL | MEDIUM | **app**: `app.enableShutdownHooks()` в setup-app.ts (строка 47) — NestJS обрабатывает SIGTERM. **db, redis**: официальные образы обрабатывают SIGTERM корректно. **db_admin, redis_admin, db_backup**: graceful shutdown не настроен. В docker-compose.yml **отсутствует** `stop_grace_period` для всех сервисов. | 1) Добавить `stop_grace_period: 30s` для `app`, `db`, `redis`. 2) Для db_backup обработать SIGTERM/SIGINT в backup.ts. 3) Для pgadmin4 и redis-commander явно указать `stop_grace_period`. | Нет |
| DEP-08 | .dockerignore исключает node_modules, .env, dist | FAIL | HIGH | `.dockerignore` содержит: `node_modules/`, `.idea/`, `docker-compose.yml`, `Dockerfile`, `/dist`, `/data`. **`.env` отсутствует** — файл с секретами попадает в build context. Хотя Dockerfile удаляет его на строке 10 (`rm -rf .git .env`), он всё равно передаётся Docker-демону и может остаться в слоях кэша. | Добавить `.env` и `.env.local` в .dockerignore. | Нет |

## Audit Coverage

| Компонент | Файл | Проверен |
|-----------|------|----------|
| Dockerfile | `/home/dex/Документы/Work/liteend/Dockerfile` | Да |
| Docker Compose | `/home/dex/Документы/Work/liteend/docker-compose.yml` | Да |
| Dockerfile (db backup) | `/home/dex/Документы/Work/liteend/Dockerfile.database-backup` | Да |
| .dockerignore | `/home/dex/Документы/Work/liteend/.dockerignore` | Да |
| .env.example | `/home/dex/Документы/Work/liteend/.env.example` | Да |
| Healthcheck script | `/home/dex/Документы/Work/liteend/healthcheck.sh` | Да |
| Bootstrap | `/home/dex/Документы/Work/liteend/src/bootstrap/setup-app.ts` | Да |
| Main entry | `/home/dex/Документы/Work/liteend/src/main.ts` | Да |
| DotenvValidator | `/home/dex/Документы/Work/liteend/src/common/dotenv-validator/dotenv-validator.service.ts` | Да |
| DotenvValidator module | `/home/dex/Документы/Work/liteend/src/common/dotenv-validator/dotenv-validator.module.ts` | Да |
| App module | `/home/dex/Документы/Work/liteend/src/app.module.ts` | Да |
| Health controller | `/home/dex/Документы/Work/liteend/src/infrastructure/health/health.controller.ts` | Да |
| Health module | `/home/dex/Документы/Work/liteend/src/infrastructure/health/health.module.ts` | Да |
| Backup tool | `/home/dex/Документы/Work/liteend/src/db-backup-tool/backup.ts` | Да |
| Prisma Studio service | `/home/dex/Документы/Work/liteend/src/dev-tools/prisma-studio/prisma-studio.service.ts` | Да |
| package.json | `/home/dex/Документы/Work/liteend/package.json` | Да |
| Audit baseline | `/home/dex/Документы/Work/liteend/docs/audit-baseline.yml` | Да |

## Ключевые выводы

### FAIL (3)
- **DEP-01** — Отсутствует multi-stage build. Исправить для уменьшения размера образа и поверхности атаки.
- **DEP-05** — Dev-зависимости присутствуют в production-образе. Multi-stage build решит и эту проблему.
- **DEP-08** — `.env` не в `.dockerignore`, секреты потенциально утекают в build context.

### PARTIAL (2)
- **DEP-03** — Только 3 из 6 сервисов имеют healthcheck.
- **DEP-04** — Валидация env отключена в production; в `backup.ts` используются тихие fallback.
- **DEP-07** — Нет `stop_grace_period`; утилитарные контейнеры без graceful shutdown.

### PASS (2)
- **DEP-02** — Ни одного hardcored credentials.
- **DEP-06** — Секреты не передаются через ENV в Dockerfile.

### Критические (немедленные) рекомендации
1. Переписать Dockerfile на multi-stage build.
2. Добавить `.env` в `.dockerignore`.
3. Включить валидацию env в production через Zod-схему при старте.

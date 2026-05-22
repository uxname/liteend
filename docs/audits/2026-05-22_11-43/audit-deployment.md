# Audit Report: Build & Deployment Configuration — 2026-05-22 11:43

## Легенда

| Статус | Значение |
|--------|----------|
| ✅ PASS | Проверка пройдена |
| ❌ FAIL | Найдено нарушение |
| ⏸ ACCEPTED | Принято в baseline |
| 🔍 UNVERIFIED | Нет данных для проверки |

Severity: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## Результаты

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| DEP-01 | Docker images используют pinned versions (нет :latest) | ❌ FAIL 🟡 | High | `Dockerfile:1` — `node:lts-alpine` (плавающий тег lts, не фиксированная версия) | **1. Заменить на `node:22.15.1-alpine` (конкретная версия)** \\ 2. Для админ-контейнеров заменить `:latest` на конкретные версии \\ 3. Использовать digest-based pin (`node@sha256:...`) | Нет |
| | | | | `Dockerfile.database-backup:1` — `node:lts-alpine` (тот же плавающий тег) | | |
| | | | | `docker-compose.yml:64` — `dpage/pgadmin4:latest` | | |
| | | | | `docker-compose.yml:97` — `rediscommander/redis-commander:latest` | | |
| DEP-02 | Контейнеры запускаются от непривилегированного пользователя (USER nonroot) | ❌ FAIL 🟠 | High | `Dockerfile.database-backup:1-7` — нет `USER` директивы, контейнер бежит от root | **1. Добавить `RUN addgroup -S app && adduser -S app -G app` и `USER app` в Dockerfile.database-backup** \\ 2. Использовать `USER node` (образ на основе node:alpine) \\ 3. Задокументировать риск и принять | Нет |
| | | ✅ PASS | High | `Dockerfile:22` — `USER node` установлен | — | — |
| DEP-03 | Multi-stage build разделяет dev и prod зависимости | ✅ PASS | High | `Dockerfile:1-23` — два стейджа: `build` (собирает) и `production` (только prod-зависимости + артефакты) | — | — |
| DEP-04 | .dockerignore исключает node_modules, .git, .env | ❌ FAIL 🟡 | High | `.dockerignore:1-7` — нет `.git` | **1. Добавить `.git` в .dockerignore** \\ 2. Также добавить `*.md`, `test/`, `coverage/` \\ 3. Оставить как есть (учитывая CI, где .git может понадобиться) | Нет |
| | | ✅ PASS | High | `.dockerignore:1,7` — `node_modules/` и `.env` исключены | — | — |
| DEP-05 | HEALTHCHECK определён | ✅ PASS | High | `docker-compose.yml:35-40` — healthcheck через `/app/healthcheck.sh` | — | — |
| DEP-06 | Секреты не hardcoded в Dockerfile (нет в ENV) | ✅ PASS | High | `Dockerfile:1-23` — нет секретов в ENV. Только плейсхолдеры для prisma generate в build stage (`Dockerfile:7`) | — | — |
| DEP-07 | .env исключён из VCS | ✅ PASS | High | `.gitignore:37,38` — `.env` и `.env.*` в gitignore | — | — |
| DEP-08 | .env.example документирует все переменные окружения | ❌ FAIL 🟢 | Medium | `.env.example:1-54` — документированы не все переменные (нет `NODE_ENV`, `TZ`, `DATABASE_URL` для Prisma, `REDIS_URL`). Нет маркировки required vs optional | **1. Добавить колонку required/optional в .env.example** \\ 2. Добавить недостающие переменные \\ 3. Убрать чувствительные значения (пароли) из example, оставить пустые значения | Нет |
| DEP-09 | NODE_ENV корректно устанавливается для production | ✅ PASS | High | `Dockerfile:12` — `ENV NODE_ENV=production` | — | — |
| DEP-10 | npm ci используется вместо npm install в Docker | ❌ FAIL 🟠 | High | `Dockerfile.database-backup:4` — `npm i` (без lockfile гарантий) | **1. Заменить `npm i` на `npm ci` в Dockerfile.database-backup** \\ 2. Сначала скопировать `package*.json` отдельно, потом `npm ci` \\ 3. Переписать backup-образ на multi-stage с копированием только нужных артефактов | Нет |
| | | ✅ PASS | High | `Dockerfile:5,14` — `npm ci` в обоих стейджах | — | — |
| DEP-11 | Ограничения ресурсов контейнера определены (CPU limits, Memory limits) | ❌ FAIL 🟡 | Medium | `docker-compose.yml:10-139` — ни один сервис не имеет `deploy.resources.limits` | **1. Добавить `deploy.resources.limits.memory: 512M` и `cpus: '0.5'` для app** \\ 2. Добавить лимиты для всех сервисов \\ 3. Добавить `mem_reservation` для гарантированного минимума | Нет |
| DEP-12 | Возможность запуска с read-only root filesystem проверена | ❌ FAIL 🟢 | Medium | `docker-compose.yml:10-139` — нет `read_only: true` ни у одного сервиса | **1. Добавить `read_only: true` для app + tmpfs mount для /tmp** \\ 2. Для сервисов, пишущих на диск (db, redis), read-only не применим — задокументировать \\ 3. Оставить как есть для dev-окружения | Нет |

---

## Детали найденных проблем

### DEP-01 — Плавающие теги образов 🟡

**Проблема:** `node:lts-alpine` обновляется при каждом LTS-релизе. Разные сборки в разное время дадут разные версии Node.js. `:latest` для админок — непредсказуемое обновление.

**Где:**
- `Dockerfile:1` — `FROM node:lts-alpine AS build`
- `Dockerfile:9` — `FROM node:lts-alpine AS production`
- `Dockerfile.database-backup:1` — `FROM node:lts-alpine`
- `docker-compose.yml:64` — `image: dpage/pgadmin4:latest`
- `docker-compose.yml:97` — `image: rediscommander/redis-commander:latest`

**Риск:** Непредсказуемые изменения в контейнерах при пересборке. Node.js может обновиться с мажорными изменениями.

---

### DEP-02 — Dockerfile.database-backup от root 🟠

**Проблема:** Контейнер бэкапа БД запускается от root. При компрометации — полный доступ к хосту.

**Где:** `Dockerfile.database-backup:1-7` — нет `USER` директивы.

**Риск:** Повышение привилегий через backup-контейнер.

---

### DEP-04 — .git не исключён из .dockerignore 🟡

**Проблема:** Вся git-история (может быть сотни MB) отправляется в Docker build context.

**Где:** `.dockerignore:1-7` — в списке нет `.git`.

**Риск:** Увеличение времени сборки и размера build context.

---

### DEP-08 — .env.example неполный 🟢

**Проблема:** В .env.example используются дефолтные dev-пароли (admin/admin). Нет маркировки required vs optional. Нет некоторых переменных (TZ, DATABASE_URL).

**Где:** `.env.example:1-54`.

**Риск:** Разработчик может скопировать example как есть и забыть сменить пароли.

---

### DEP-10 — npm i в Dockerfile.database-backup 🟠

**Проблема:** `npm i` не использует lockfile, может установить другие версии зависимостей.

**Где:** `Dockerfile.database-backup:4` — `RUN npm i --legacy-peer-deps tsx pino pino-pretty`.

**Риск:** Недетерминированная сборка. Разные сборки могут получить разные зависимости.

---

### DEP-11 — Нет ограничений ресурсов 🟡

**Проблема:** Ни один сервис в docker-compose.yml не имеет memory/cpu лимитов.

**Где:** `docker-compose.yml:10-139` — во всех сервисах.

**Риск:** Memory leak в любом контейнере может положить весь хост.

---

### DEP-12 — Нет read-only root filesystem 🟢

**Проблема:** Приложение может писать в корневую ФС контейнера.

**Где:** `docker-compose.yml:10-139`.

**Риск:** Без read-only файловой системы контейнер может быть труднее обезопасить.

---

## Хорошие практики (что уже ок)

| Проверка | Статус | Детали |
|----------|--------|--------|
| Multi-stage build | ✅ | build → production, clean separation |
| Non-root в основном Dockerfile | ✅ | `USER node` в production stage |
| HEALTHCHECK в compose | ✅ | Для app, db, redis |
| npm ci в основном Dockerfile | ✅ | Детерминированные установки |
| --production флаг | ✅ | `npm ci --production` без devDependencies |
| source maps | ✅ | `--enable-source-maps` в start:prod |
| retry logic в prestart:prod | ✅ | Exponential backoff для миграций |
| .env в .gitignore | ✅ | `.env` и `.env.*` |
| Secrets не в Dockerfile | ✅ | Плейсхолдеры в build stage |
| Logging конфиг в compose | ✅ | json-file с ротацией (50MB x 5) |
| restart: unless-stopped | ✅ | Для всех сервисов |
| depends_on с condition | ✅ | Дожидается healthy db и redis |

---

## Audit Coverage

**Проверено:**
- `Dockerfile`
- `Dockerfile.database-backup`
- `docker-compose.yml`
- `.dockerignore`
- `.gitignore`
- `.env.example`
- `.env`
- `package.json` (scripts)
- `healthcheck.sh`
- `tsconfig.json`

**Пропущено:**
- Нет CI/CD конфигов (`.github/`, `.gitlab-ci.yml`, `Jenkinsfile`) — не обнаружены
- Kubernetes манифесты — не обнаружены
- Terraform — не обнаружен

**Файлов проверено: 10 | Пропущено: 0**

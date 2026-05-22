# Audit Report: Утечка секретов — 2026-05-22 11:43

## Что проверялось

- Все `.ts` файлы в `src/` — на хардкод паролей, токенов, API-ключей, приватных ключей
- Конфигурационные файлы: `.env`, `.env.example`, `Dockerfile`, `docker-compose.yml`, `kodu.json`
- Файлы в `src/db-backup-tool/`
- Git history на предмет утёкших секретов
- `.gitignore` — корректность исключения секретных файлов
- `lefthook.yml`, `.gitleaksignore` — наличие автоматического сканирования

## Результаты

### ❌ FAIL 🟠 — Hardcoded пароли-заглушки в Dockerfile

**Файл:** `Dockerfile:7`

```dockerfile
RUN DATABASE_HOST=placeholder DATABASE_PORT=5432 DATABASE_USER=placeholder DATABASE_PASSWORD=placeholder DATABASE_NAME=placeholder npm run db:gen && npm run build
```

Хотя значения — очевидные заглушки (`placeholder`), они представляют собой hardcoded credentials в сборке Docker. Любой, кто имеет доступ к образу, может их увидеть.

**Рекомендация:** Передавать эти переменные через `--build-arg` или использовать `DATABASE_URL` как единственный env-аргумент сборки. `prisma.config.ts` и так поддерживает `DATABASE_URL` как fallback.

---

### ❌ FAIL 🟠 — Hardcoded fallback-пароль в скриптах бэкапа

**Файлы:**
- `src/db-backup-tool/backup.ts:26`
- `src/db-backup-tool/restore.ts:22`

```typescript
DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
```

Если переменная окружения `DATABASE_PASSWORD` не задана, скрипт подставит пароль `postgres`. Это может привести к подключению к неверной БД в production с дефолтным паролем.

**Рекомендация:** Убрать fallback — требовать явного указания `DATABASE_PASSWORD` через окружение. Либо выбросить ошибку, если переменная не задана.

---

### ❌ FAIL 🔴 — Git history содержит реальные OIDC-credentials

Файл `.env.example` ранее содержал реальные credentials стороннего OIDC-провайдера (Logto.app). Эти значения попали в git history и до сих пор доступны:

| Значение | Описание | Коммиты |
|----------|----------|---------|
| `https://oalmxx.logto.app/oidc` | Real OIDC issuer URL | `efd94d7`, `706fa9b`, `9d9fa16`, `418dcf0`, `1ce9c2a`, `89b17da`, `37d524b` |
| `sl51b8k688hfuw9it0dqz` | Real OIDC Client ID | `efd94d7`, `706fa9b`, `9d9fa16`, `418dcf0`, `1ce9c2a`, `89b17da`, `37d524b` |
| `https://oalmxx.logto.app/api` | Real OIDC Audience (older) | `418dcf0` (and earlier) |
| `https://oalmxx.logto.app/oidc/jwks` | Real JWKS URI | Same commits as issuer |

**Важно:** Хотя это не super-секретные данные (Client ID не является секретом в OIDC spec), issuer URL раскрывает используемого провайдера, что повышает поверхность атаки. Сами credentials были заменены на placeholder'ы в коммите `9d9fa16`.

**Рекомендация:** Очистить git history от этих значений с помощью `git filter-repo` или `BFG Repo-Cleaner`, особенно если репозиторий публичный. Как минимум — сменить Client ID в OIDC-провайдере.

---

### ❌ FAIL 🟡 — Слабые дефолтные пароли в Dev Tools

**Файл:** `.env.example` (и локальный `.env`)

```
LOGS_ADMIN_PANEL_PASSWORD=admin
DB_ADMIN_PASSWORD=admin
REDIS_PASSWORD=redis
BULL_BOARD_PASSWORD=admin
PRISMA_STUDIO_PASSWORD=admin
```

Все dev-инструменты используют тривиальные пароли по умолчанию. Если dev-сервер будет случайно доступен извне, эти панели будут скомпрометированы.

**Рекомендация:** Добавить предупреждение в `.env.example`, что эти пароли должны быть изменены перед любым non-local деплоем. Для dev-среды это приемлемо, но стоит документировать риск.

---

### ✅ PASS — `.env` в `.gitignore`

`.env` и `.env.*` исключены из VCS. Ни один `.env` файл не отслеживается git. Проверено через `git ls-files`.

---

### ✅ PASS — Нет захардкоженных API-ключей и токенов в исходном коде

Поиск по паттернам (`ghp_`, `sk-`, `-----BEGIN.*PRIVATE KEY-----`, `xox[abp]-`) не дал результатов. В `kodu.json` ссылка на переменную окружения `OPENAI_API_KEY` — корректное использование.

---

### ✅ PASS — Тесты не содержат реальных секретов

Файлы `src/common/auth/jwt.strategy.spec.ts:10` и `src/common/logger/gql-logging.interceptor.spec.ts:110` содержат тестовые заглушки (`'test-secret'`, `'secret123'`). Это ожидаемо для модульных тестов и не представляет риска.

---

### ✅ PASS — Настроено автоматическое сканирование

**Файл:** `.gitleaksignore` — существует, содержит 3 известных ложных срабатывания из старого кода.

**lefthook.yml:** pre-commit hook настроен.

---

### ⚠️ INFO — Локальный `.env` содержит реальный Client ID

Файл `.env` на диске (не в git) содержит:
```
OIDC_AUDIENCE=sl51b8k688hfuw9it0dqz
```

Это тот же Client ID, что был ранее в `.env.example`. Причина — файл не пересоздавался после чистки `.env.example`. Рекомендуется обновить.

**Рекомендация:** Сгенерировать новый Client ID в Logto.app, обновить локальный `.env` и `.env.example`.

---

### ⚠️ INFO — OIDC Mock Mode может быть опасен в production

**Файл:** `src/common/auth/jwt-auth.guard.ts:30-35`

```typescript
const isMockEnabled =
  this.configService.get<string>('OIDC_MOCK_ENABLED') === 'true';
```

Если `OIDC_MOCK_ENABLED=true` случайно останется в production, аутентификация будет полностью отключена — любой запрос получит роль ADMIN/USER. В `.env.example` и `.env` этот флаг включён.

**Рекомендация:** Добавить защиту в `setup-app.ts`, которая запрещает `OIDC_MOCK_ENABLED=true` при `NODE_ENV=production`. Или удалить mock-логику из production-сборки через tree-shaking.

---

## Итог

| Статус | Кол-во |
|--------|--------|
| ✅ PASS | 4 |
| ❌ FAIL 🔴 | 1 (Git history — OIDC credentials) |
| ❌ FAIL 🟠 | 2 (Dockerfile заглушки, fallback-пароль в бэкапе) |
| ❌ FAIL 🟡 | 1 (Слабые дефолтные пароли) |
| ⚠️ INFO | 2 (Локальный .env Client ID, OIDC Mock) |

### Важные находки

1. **🔴 Git history содержит реальные OIDC credentials** — `OIDC_AUDIENCE=sl51b8k688hfuw9it0dqz` и URL провайдера в истории коммитов. Требуется очистка истории или смена Client ID у провайдера.
2. **🟠 Dockerfile** — hardcoded placeholder credentials в build-time. Низкий риск, но нарушает принцип "ничего не хардкодить".
3. **🟠 backup.ts / restore.ts** — fallback-пароль `postgres` может скрыть ошибку конфигурации в production.
4. **🟡 Dev tools пароли** — `admin`/`redis` везде. Документировать необходимость смены для non-local сред.

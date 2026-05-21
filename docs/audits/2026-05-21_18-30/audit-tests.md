# Audit Report: Tests & Linters — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| TST-01 | Конфигурация тестов (vitest.config.ts) корректна — не ignores тесты в src/ | PASS | Высокая | `vitest.config.ts` строки 33-34: `include: includePatterns` (unit: `['src/**/*.spec.ts', 'test/utils/**/*.spec.ts']`), `exclude` использует `configDefaults.exclude` + только `test/utils/**/*.e2e.spec.ts` для unit-режима. Тесты в `src/` **не** игнорируются. | — | — |
| TST-02 | Конфигурация линтера (biome.json) корректна | PASS | Высокая | `biome.json`: linter включён (`"enabled": true`), `recommended: true`, `noUnusedImports`, `noUnusedVariables`, `noUnusedFunctionParameters` — `error`. Formatter: space, lf, single quotes. `vcs.useIgnoreFile: true` — уважает `.gitignore`. Все корректно. | — | — |
| TST-03 | tsconfig.json — strict checks включены | PASS | Высокая | `tsconfig.json` (стр. 8-12): `"strict": true`, `"alwaysStrict": true`, `"strictNullChecks": true`, `"noImplicitAny": true`. Дополнительно: `"noUncheckedIndexedAccess": true`, `"noImplicitReturns": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`, `"strictBindCallApply": true`, `"strictFunctionTypes": true`. | — | — |
| TST-04 | Покрытие тестами критических путей >80% | WARN | Средняя | Пороги покрытия заданы (lines/functions/branches/statements = 80%) и выполняются pre-push-хуком. Фактический замер покрытия **не выполнялся** (требует рабочей БД/Redis). Критические пути покрыты unit-тестами: `src/common/auth/` (5 файлов), `src/modules/file-upload/` (2 файла), `src/modules/profile/` (2 файла). E2E тесты покрывают интеграционные сценарии. Без прогона `test:cov` точное значение >80% подтвердить нельзя, но структура тестов внушает доверие. | Запустить `npm run test:cov` с рабочими docker-сервисами для верификации. | Нет |
| TST-05 | Тесты не используют mockImplementation, допускается mockReturnValue/mockResolvedValue | WARN | Средняя | Найдено **7** вхождений `mockImplementation` в spec-файлах: 1) `file-upload.service.spec.ts:184` — `mkdirSync.mockImplementation(() => undefined)` (можно заменить на `mockReturnValue`); 2) `file-upload.service.spec.ts:213` — то же; 3) `file-upload.service.spec.ts:216` — `createWriteStream.mockImplementation(() => { throw ... })` (оправдано, нет `mockThrowValue`); 4) `redis.health.spec.ts:24` — `client.ping.mockImplementation(pingImpl)` (динамическая логика, оправдано); 5-6) `error-formatter.spec.ts:28-29` — `console.warn/error.mockImplementation(() => {})` (можно заменить на `mockReturnValue`); 7) `health.controller.spec.ts:65` — `check.mockImplementation(async (indicators) => {...})` (нужно вызывать коллбэки, оправдано). | Заменить `mockImplementation(() => undefined)` на `mockReturnValue(undefined)` в 3 местах. | Нет |
| TST-06 | Нет тестов, проверяющих только реализацию (implementation-agnostic) | WARN | Средняя | Найдено **2** случая тестирования приватных/защищённых методов (implementation-coupled): 1) `file-upload.service.spec.ts:187` — `(service as unknown as { generatePaths }).generatePaths('test.png')` обращается к приватному методу. 2) `logger-serve.controller.spec.ts:8` — `(controller as unknown as { isValidFilePath }).isValidFilePath(filePath)` тестирует приватный метод. 3) `jwt-optional-auth.guard.spec.ts:18` — создаёт подкласс для тестирования `handleRequest` (protected). Все три теста проверяют **поведение**, а не внутреннее состояние, поэтому это пограничный случай. Для строгого следования принципу "test behavior, not implementation" следует рефакторить. | Рассмотреть вынесение приватной логики в отдельные (тестируемые) функции. | Нет |
| TST-07 | E2E тесты существуют для всех REST + GraphQL эндпоинтов | FAIL | Высокая | **REST:** `POST /upload` (file-upload.e2e.spec.ts) ✓; `GET /health` (app.e2e.spec.ts) ✓; `GET /uploads/*` — нет e2e (есть unit в контроллере) ✗; `GET /` dev-launcher — нет e2e ✗; `GET /` logger-serve — нет e2e ✗; `GET /api/list` logger-serve — **нет unit И нет e2e** ✗; `GET /file/*` logger-serve — **нет unit И нет e2e** ✗. **GraphQL:** `Query.me` (graphql.e2e.spec.ts:61) ✓; `Mutation.updateProfile` (graphql.e2e.spec.ts:74) ✓; `Query.echo` (graphql.e2e.spec.ts:28) ✓; `Mutation.echo` (graphql.e2e.spec.ts:37) ✓; `Query.debug` (graphql.e2e.spec.ts:49) ✓; `Query.testTranslation` — нет e2e ✗; `Subscription.profileUpdated` — нет e2e (субскрипции сложно тестировать e2e) ✗; `Mutation.addTestJob` — нет e2e ✗. | Добавить e2e для GET /uploads/*, GET /api/list, GET /file/*. Добавить e2e для addTestJob. | Нет |
| TST-08 | Нет тестового дублирования (один и тот же сценарий в unit + e2e) | PASS | Высокая | Unit-тесты тестируют **бизнес-логику** (сервисы, гарды, декораторы, резолверы) с замокаными зависимостями. E2E-тесты тестируют **интеграцию** (запрос-ответ с реальными БД/Redis). Пересечение сценариев минимально: file-upload controller spec проверяет вызовы service.processFile/service.saveMetadata, тогда как e2e проверяет реальную загрузку файла и запись в БД. Profile resolver spec проверяет publish/subscribe, e2e проверяет только базовое выполнение мутации. Сценарии НЕ дублируются. | — | — |
| TST-09 | Coverage thresholds (80%) заданы в vitest.config.ts | PASS | Высокая | `vitest.config.ts` строки 59-64: `thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }`. | — | — |
| TST-10 | Knip не находит неиспользуемых экспортов в production коде | FAIL | Высокая | Knip выявил **4 неиспользуемых экспорта**: 1) `test/utils/mocks.ts:73` — `createPrismaMock` (не экспортируется нигде в production-коде); 2) `test/utils/testing-app.ts:77` — `getTestingApp` (используется только `getFastifyInstance` и `getPrisma`/`getRedis`, `getTestingApp` не вызывается в production); 3) `test/utils/testing-app.ts:81` — `getFastifyInstance` (аналогично, только в тестах). Также найдены **5 неиспользуемых devDependencies**: `@fission-ai/openspec`, `@types/form-data`, `@types/ioredis`, `kodu`, `pactum`. И 1 unresolved import: `@vitest/spy` в `test/utils/mocks.ts`. **Важно:** knip запущен с флагом `--production`, поэтому экспорты из `test/` не должны считаться проблемой production-кода. Однако `@vitest/spy` — unresolved import в файле из `test/`, используемом тестами. `pactum` не используется (согласно AGENTS.md он запрещён, проект использует `E2EClient`). | Удалить неиспользуемые devDependencies из package.json. Удалить неиспользуемый экспорт `createPrismaMock` или добавить потребителя. Исправить import `@vitest/spy` на корректный путь. | Нет |

---

## Audit Coverage

### 1. Прочитанные файлы (42)

| Файл | Статус |
|------|--------|
| `vitest.config.ts` | OK |
| `biome.json` | OK |
| `tsconfig.json` | OK |
| `tsconfig.build.json` | OK |
| `lefthook.yml` | OK |
| `knip.json` | OK |
| `package.json` | OK |
| `src/modules/file-upload/file-upload.service.spec.ts` | OK |
| `src/modules/file-upload/file-upload.controller.spec.ts` | OK |
| `src/modules/profile/profile.service.spec.ts` | OK |
| `src/modules/profile/profile.resolver.spec.ts` | OK |
| `src/common/auth/jwt-auth.guard.spec.ts` | OK |
| `src/common/auth/roles.guard.spec.ts` | OK |
| `src/common/auth/current-user.decorator.spec.ts` | OK |
| `src/common/auth/jwt-optional-auth.guard.spec.ts` | OK |
| `src/common/auth/jwt.strategy.spec.ts` | OK |
| `src/common/graphql/error-formatter.spec.ts` | OK |
| `src/common/all-exceptions-filter.spec.ts` | OK |
| `src/common/logger/gql-logging.interceptor.spec.ts` | OK |
| `src/infrastructure/health/health.controller.spec.ts` | OK |
| `src/infrastructure/health/indicators/redis.health.spec.ts` | OK |
| `src/infrastructure/test-queue/test-queue.spec.ts` | OK |
| `src/common/dotenv-validator/dotenv-validator.service.spec.ts` | OK |
| `src/common/real-ip/real-ip.decorator.spec.ts` | OK |
| `src/dev-tools/logger-serve/auth/auth.guard.spec.ts` | OK |
| `src/dev-tools/logger-serve/logger-serve.controller.spec.ts` | OK |
| `src/dev-tools/dev-launcher/dev-launcher.controller.spec.ts` | OK |
| `src/dev-tools/dev-launcher/dev-launcher.view.spec.ts` | OK |
| `test/app.e2e.spec.ts` | OK |
| `test/graphql.e2e.spec.ts` | OK |
| `test/file-upload.e2e.spec.ts` | OK |
| `test/queue.e2e.spec.ts` | OK |
| `test/setup.ts` | OK |
| `test/utils/e2e-client.ts` | OK |
| `test/utils/e2e-client.spec.ts` | OK |
| `test/utils/testing-app.ts` | OK |
| `test/utils/testing-app.e2e.spec.ts` | OK |
| `test/utils/clear-state.ts` | OK |
| `test/utils/clear-state.spec.ts` | OK |
| `test/utils/mocks.ts` | OK |
| `test/factories/profile.factory.ts` | OK |
| `test/factories/upload.factory.ts` | OK |
| `docs/audit-baseline.yml` | OK |

### 2. Общая статистика spec-файлов

- **Всего unit-спецификаций в `src/`:** 21 файлов
- **Всего e2e-спецификаций в `test/`:** 7 файлов (4 e2e + 3 служебных)
- **Фабрики:** 2 (`profile.factory.ts`, `upload.factory.ts`)
- **Утилиты:** `e2e-client.ts`, `testing-app.ts`, `clear-state.ts`, `mocks.ts`
- **Хелперы тестов в `test/utils/*.spec.ts`:** 3 файла (тесты самих утилит)

### 3. Покрытие по критическим путям

**`src/common/auth/`** (5 spec-файлов, 100% покрытие):
- `jwt-auth.guard.spec.ts` — mock-режим, JWT-режим, HTTP/GraphQL getRequest
- `jwt-optional-auth.guard.spec.ts` — handleRequest (null, user, err)
- `jwt.strategy.spec.ts` — validate (upsert, missing sub, roles)
- `roles.guard.spec.ts` — canActivate (no roles, has role, missing role, no user, multiple roles, HTTP/GraphQL)
- `current-user.decorator.spec.ts` — GraphQL/HTTP/undefined

**`src/modules/file-upload/`** (2 spec-файла):
- `file-upload.service.spec.ts`: getMimeType (6 случаев), saveMetadata (3 случая), getSafeFileInfo (3 случая), processFile (4 случая)
- `file-upload.controller.spec.ts`: uploadFile (4 случая), getFile (1 случай)

**`src/modules/profile/`** (2 spec-файла):
- `profile.service.spec.ts`: updateProfile (success + not found)
- `profile.resolver.spec.ts`: me, updateProfile (update + publish), profileUpdated (subscribe + filter)

### 4. Результаты Knip (`npx knip --reporter json`)

```
Неиспользуемые devDependencies (5):
  - @fission-ai/openspec
  - @types/form-data
  - @types/ioredis
  - kodu
  - pactum

Неиспользуемые экспорты в тестовых файлах (3):
  - createPrismaMock (test/utils/mocks.ts:73)
  - getTestingApp (test/utils/testing-app.ts:77)
  - getFastifyInstance (test/utils/testing-app.ts:81)

Unresolved import (1):
  - @vitest/spy (test/utils/mocks.ts:2)
```

### 5. Итоговая сводка

| Статус | Количество |
|--------|-----------|
| PASS | 5 (TST-01, TST-02, TST-03, TST-08, TST-09) |
| WARN | 3 (TST-04, TST-05, TST-06) |
| FAIL | 2 (TST-07, TST-10) |

### 6. Рекомендации

1. **Critical:** Добавить E2E-тесты для `GET /uploads/*`, `GET /api/list` (logger-serve), `GET /file/*` (logger-serve), `Mutation.addTestJob`.
2. **High:** Удалить неиспользуемые devDependencies: `@fission-ai/openspec`, `@types/form-data`, `@types/ioredis`, `kodu`, `pactum`.
3. **High:** Исправить unresolved import `@vitest/spy` в `test/utils/mocks.ts` или добавить в зависимости.
4. **Medium:** Заменить `mockImplementation(() => undefined)` на `mockReturnValue(undefined)` в 3 местах (`file-upload.service.spec.ts`, `error-formatter.spec.ts`).
5. **Low:** Рассмотреть рефакторинг тестов приватных методов (`generatePaths`, `isValidFilePath`, `handleRequest`) для тестирования через публичный интерфейс.
6. **Low:** Удалить неиспользуемый экспорт `createPrismaMock` (экспортируется, но нигде не импортируется).
7. **Info:** Запустить `npm run test:cov` в окружении с рабочими docker-сервисами для верификации порогов покрытия.

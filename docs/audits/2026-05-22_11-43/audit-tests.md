# Audit Report: Test & Linter Integrity — 2026-05-22 12:00

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| TST-01 | TypeScript strict mode включён | ✅ PASS | High | `tsconfig.json:8` — `strict: true`, `strictNullChecks: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`, `noImplicitReturns: true` | — | — |
| TST-02 | Coverage thresholds настроены и применяются в CI | ✅ PASS | High | `vitest.config.ts:59-64` — thresholds lines/functions/branches/statements все 80%. `npm run test:cov` проходит: Lines 94.13%, Branches 87.05%, Functions 86.48%, Statements 93.07% | — | — |
| TST-03 | Pre-commit/pre-push хуки запускают проверки | ✅ PASS | High | `lefthook.yml` — pre-commit: gitleaks + `npm run check`. pre-push: `npm run check` + `npm run test:all` | — | — |
| TST-04 | Критические пути покрыты тестами | ❌ FAIL 🟡 | High | `src/common/auth/auth.service.ts` — 0% покрытие. Три критических метода (`findOrCreateProfile`, `findProfileBySub`, `findOrCreateDefaultMockUser`) без единого теста | **1. Написать `src/common/auth/auth.service.spec.ts` с тестами на все 3 метода (мок Prisma + Redis)** \\ 2. Добавить auth.service в проверку покрытия CI с минимальным порогом 50% для этого файла \\ 3. Оставить, задокументировать риск | Нет |
| TST-05 | Тесты изолированы — нет shared mutable state | ✅ PASS | High | `setup.ts` — E2E beforeEach очищает БД (`clearDatabase`) и Redis (`clearRedis`). Все spec-файлы используют `beforeEach`/`afterEach` с `vi.clearAllMocks()` | — | — |
| TST-06 | Нет пропущенных/зафиксированных тестов | ✅ PASS | High | Проверены все 20 spec-файлов — ни одного `.only` или `.skip`. Нет закомментированных тестов | — | — |
| TST-07 | Тесты проверяют поведение, а не детали реализации | ✅ PASS | High | Все тесты следуют AAA (Arrange-Act-Assert). Нет `expect(true).toBe(true)`. Моки изолируют внешние зависимости | — | — |
| TST-08 | Нет нестабильных тестов (Math.random, Date.now без mock) | ✅ PASS | Medium | `Date.now()` в тестах не используется. `Math.random()` только в фабриках (`profile.factory.ts:8`, `upload.factory.ts:7`) — не влияет на assertions. poll-цикл в `queue.e2e.spec.ts` имеет таймаут 8s | — | — |
| TST-09 | Snapshot-тесты не захламляют отчёт | ✅ PASS | High | Snapshot-тесты не используются в проекте | — | — |

## Дополнительные замечания

### 1. Покрытие модуля `src/common/auth` ниже 80%
Несмотря на прохождение глобальных порогов, модуль `src/common/auth` имеет показатели:
- Statements: 79.48% (ниже 80%)
- Functions: 66.66% (ниже 80%)
- Lines: 78.66% (ниже 80%)

Причина — `auth.service.ts` с 0% покрытия. Остальные файлы модуля покрыты хорошо.

### 2. `useUnknownInCatchVariables: false` в tsconfig
`tsconfig.json:5` — отключено строгое типизирование catch-переменных. Это допустимое ослабление (catch-блоки в коде корректно обрабатывают `unknown`), но снижает strict mode.

### 3. Непокрытые ветки в `file-upload.controller.ts:73`
Строка `ip ?? 'unknown'` — ветка fallback (когда ip undefined/null) не покрыта тестом.
\
**Решение:** Добавить E2E-тест вызова upload без IP, или unit-тест с `@RealIp()`, возвращающим undefined.

### 4. Отсутствует E2E-тест на updateProfile
E2E тест `graphql.e2e.spec.ts:74-81` проверяет только что запрос возвращает 200, но не проверяет, что профиль реально обновляется в БД.

### 5. Фабрики используют `Date.now()` и `Math.random()`
`test/factories/profile.factory.ts:8` и `test/factories/upload.factory.ts:7` — это допустимо для генерации уникальных ID в E2E, но может давать нестабильные коллизии при параллельном запуске. Рекомендуется заменить на `randomUUID()`.

## Audit Coverage

**Проверено:**
- `src/modules/**/*.ts` — оба модуля (profile, file-upload)
- `src/common/auth/**/*.ts` — все файлы
- `src/common/**/*.spec.ts` — все spec-файлы
- `src/infrastructure/**/*.ts` — health, test-queue
- `src/dev-tools/**/*.ts` — dev-launcher, logger-serve
- `test/**/*.ts` — все тесты, фабрики, утилиты
- Конфиги: vitest.config.ts, tsconfig.json, biome.json, lefthook.yml, knip.json

**Пропущено:**
- `src/db-backup-tool/**` — excluded from coverage
- `src/bootstrap/**` — excluded from coverage
- `src/@generated/**` — excluded from coverage
- `src/dev-tools/prisma-studio/**` — dev-only
- `src/dev-tools/bull-board/**` — dev-only
- `src/dev-tools/debug/**` — dev-only

**Файлов проверено:** 45 | **Пропущено:** 15

## Итог

✅ Конфигурации тестов и линтеров в порядке. Coverage thresholds работают, pre-commit хуки настроены, все тесты проходят (22 файла, 123 теста). Единственный средний риск — **`auth.service.ts` с 0% покрытия**.

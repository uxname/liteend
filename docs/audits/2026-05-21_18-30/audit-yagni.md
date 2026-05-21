# Audit Report: Over-engineering & YAGNI — 2026-05-21 18:30

## Summary

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| YAGNI-01 | Нет закомментированного кода | :white_check_mark: PROCEED | 100% | Grep: ни одного случая закомментированного импорта/функции/класса | — | — |
| YAGNI-02 | Нет dead code | :warning: ISSUES FOUND | 90% | 8 точек dead code (см. ниже) | Удалить | Нет |
| YAGNI-03 | Абстракции оправданы | :warning: ISSUES FOUND | 85% | 3 неоправданных абстракции (см. ниже) | Рефакторинг | Нет |
| YAGNI-04 | Feature flags не зафиксированы | :white_check_mark: PROCEED | 100% | `OIDC_MOCK_ENABLED` читается из env | — | — |
| YAGNI-05 | Технический долг актуален | :warning: ISSUES FOUND | 95% | 1 TODO без даты/прогресса (см. ниже) | Добавить дату/issue | Нет |

---

## YAGNI-01: Нет закомментированного кода

**Статус: PROCEED** — закомментированный код отсутствует. Полный grep по всем `.ts`-файлам не обнаружил ни одного случая закомментированных импортов, функций, классов или декораторов.

---

## YAGNI-02: Dead code

### Найденные проблемы

#### 1. `createPrismaMock` в `test/utils/mocks.ts` (строка 73)

- **Файл:** `/home/dex/Документы/Work/liteend/test/utils/mocks.ts`
- **Суть:** Экспортируется, но ни разу не импортируется нигде в кодовой базе.
- **Уверенность:** 100% (подтверждено grep + knip)
- **Решение:** Удалить экспорт `createPrismaMock`.

#### 2. `getTestingApp` в `test/utils/testing-app.ts` (строка 77)

- **Файл:** `/home/dex/Документы/Work/liteend/test/utils/testing-app.ts`
- **Суть:** Экспортируется, но нигде не импортируется.
- **Уверенность:** 100% (подтверждено grep + knip)
- **Решение:** Удалить (все E2E-тесты используют `getFastifyInstance`, который остаётся).

#### 3. `ProfileService` экспортируется из `ProfileModule` без необходимости

- **Файл:** `/home/dex/Документы/Work/liteend/src/modules/profile/profile.module.ts` (строка 7)
- **Суть:** `exports: [ProfileService]` — `ProfileService` не импортируется ни одним другим модулем. Единственный потребитель — `ProfileResolver` внутри того же модуля.
- **Уверенность:** 90% (нет внешних импортов, подтверждено grep)
- **Решение:** Убрать `ProfileService` из `exports` массива.

#### 4. `DebugResolver` экспортируется из `DebugModule` без необходимости

- **Файл:** `/home/dex/Документы/Work/liteend/src/dev-tools/debug/debug.module.ts` (строка 7)
- **Суть:** `exports: [DebugResolver]` — `DebugResolver` не импортируется ни одним другим модулем.
- **Уверенность:** 90% (подтверждено grep)
- **Решение:** Убрать `DebugResolver` из `exports`.

#### 5. `FileUploadController` экспортируется из `FileUploadModule` без необходимости

- **Файл:** `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.module.ts` (строка 10)
- **Суть:** `exports: [FileUploadController]` — никем не импортируется.
- **Уверенность:** 90% (подтверждено grep)
- **Решение:** Убрать `FileUploadController` из `exports`, также убрать его из `providers` (контроллеры не нужно дублировать в providers).

#### 6. `FileUploadController` дублируется в `providers` и `controllers`

- **Файл:** `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.module.ts` (строка 8)
- **Суть:** `FileUploadController` указан и в `providers: [...]`, и в `controllers: [...]`. Это избыточно — NestJS сам регистрирует контроллеры.
- **Уверенность:** 100%
- **Решение:** Убрать `FileUploadController` из массива `providers`.

#### 7. Неиспользуемые devDependencies (knip)

| Пакет | Тип | Описание |
|-------|-----|----------|
| `@fission-ai/openspec` | devDependencies | Нигде не используется в коде |
| `kodu` | devDependencies | Нигде не используется |
| `pactum` | devDependencies | Не используется (E2E-тесты используют `E2EClient`) |
| `@types/ioredis` | devDependencies | `ioredis` v5+ поставляет свои типы |
| `@types/form-data` | devDependencies | `form-data` поставляет свои типы |

- **Уверенность:** 100% (knip + grep)
- **Решение:** Удалить неиспользуемые пакеты из `devDependencies` в `package.json`.

#### 8. `@vitest/spy` — unlisted dependency

- **Файл:** `/home/dex/Документы/Work/liteend/test/utils/mocks.ts` (строка 2)
- **Суть:** Импорт `Mocked` и `MockedObjectDeep` из `@vitest/spy`, но этот пакет не указан в `package.json` (neither dependencies nor devDependencies). Это работает только потому, что `@vitest/spy` является транзитивной зависимостью `vitest`.
- **Уверенность:** 80% (knip flagged it as unlisted)
- **Решение:** Либо удалить импорт (типы доступны из `vitest`), либо добавить `@vitest/spy` в `devDependencies`.

---

## YAGNI-03: Абстракции оправданы

### Найденные проблемы

#### 1. `RedisService` — тонкая обёртка без расширения

- **Файл:** `/home/dex/Документы/Work/liteend/src/common/redis/redis.service.ts`
- **Суть:** `RedisService` — это тонкая обёртка вокруг `ioredis` Redis клиента. Единственный публичный метод — `getClient()`, который возвращает сырой `Redis` объект. Все потребители (например, `RedisHealthIndicator`) используют `redisService.getClient().ping()`, что означает, что абстракция не скрывает детали реализации, а просто добавляет слой косвенности.
- **Уверенность:** 75%
- **Решение:** Рассмотреть удаление `RedisService` и прямое использование `ioredis` через `@nestjs/bullmq` или фабрику, либо расширить API `RedisService` конкретными методами (например, `ping()`, `get()`, `set()`) вместо `getClient()`.

#### 2. `DotenvValidatorService` — логика в конструкторе

- **Файл:** `/home/dex/Документы/Work/liteend/src/common/dotenv-validator/dotenv-validator.service.ts`
- **Суть:** Вся логика валидации выполняется в конструкторе, и конструктор может выбросить ошибку. Это нарушает принцип единственной ответственности и делает сервис немым — он не предоставляет публичных методов. Единственная цель сервиса — выполнить побочный эффект при инициализации.
- **Уверенность:** 80%
- **Решение:** Вынести логику из конструктора в метод `validate()`, вызываемый в `onModuleInit()` провайдера, или заменить на `onApplicationBootstrap` хук.

#### 3. `ProfileService` — тривиальный сервис

- **Файл:** `/home/dex/Документы/Work/liteend/src/modules/profile/profile.service.ts`
- **Суть:** `ProfileService` содержит один метод `updateProfile`, который делает прямой `prisma.profile.update()`. Нет дополнительной бизнес-логики, валидации, кэширования или уведомлений. Сервис является чисто прослойкой для возможности будущего расширения.
- **Уверенность:** 60%
- **Решение:** Оставить как есть (вероятно, будет расширяться), но отметить как потенциальный YAGNI, если функциональность не планируется расширять.

---

## YAGNI-04: Feature flags не зафиксированы

**Статус: PROCEED**

Единственный feature flag в кодовой базе — `OIDC_MOCK_ENABLED` (в `jwt-auth.guard.ts`, строка 32), который читается из конфигурации через `ConfigService`. Ни один feature flag не захардкожен.

---

## YAGNI-05: Технический долг актуален

### Найденные проблемы

#### 1. TODO в `prisma.service.ts` без даты/прогресса

- **Файл:** `/home/dex/Документы/Work/liteend/src/common/prisma/prisma.service.ts` (строка 23)
- **Содержание:**
  ```
  // TODO: remove cast when @prisma/adapter-pg updates bundled @types/pg (currently 8.11.11, conflicts with root @types/pg 8.20.0)
  ```
- **Суть:** Нет даты, нет ссылки на issue, нет отметки о прогрессе (какая версия @prisma/adapter-pg это исправит).
- **Уверенность:** 100%
- **Решение:**
  - Проверить, всё ли ещё актуально: обновить `@prisma/adapter-pg` и проверить, устранён ли конфликт типов.
  - Если актуально — добавить дату и ссылку на GitHub issue.
  - Если не актуально — убрать каст и удалить TODO.

---

## Дополнительные находки (over-engineering)

#### 1. `TestQueueModule` — тестовая очередь в продакшене

- **Файлы:** `/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/*.ts`
- **Суть:** `TestQueueModule` предоставляет GraphQL-мутацию `addTestJob`, которая добавляет задачу в очередь BullMQ. Процессор `TestQueueProcessor` просто ждёт 1 секунду и возвращает `{ result: 'Success' }`. Этот модуль включён в `AppModule` (продакшен) и доступен через GraphQL без какой-либо аутентификации или feature flag.
- **Уверенность:** 95%
- **Решение:** Либо ограничить доступ (добавить `@UseGuards` с ADMIN ролью), либо вынести за feature flag `TEST_QUEUE_ENABLED`, либо удалить.

#### 2. `I18nModule` — избыточная интернационализация

- **Файл:** `/home/dex/Документы/Work/liteend/src/app.module.ts` (строка 104)
- **Суть:** I18n настроен с 2 языками (en, ru) и `AcceptLanguageResolver`, но в кодовой базе только 1 строка перевода (`translations.hello`) и только один потребитель — `testTranslation` query в `DebugResolver`. Это dev-инструмент, не используемый в реальном функционале приложения.
- **Уверенность:** 70%
- **Решение:** Если интернационализация не входит в road map, рассмотреть удаление I18nModule и `i18n/` директории, убрать `testTranslation` из `DebugResolver`.

#### 3. PrismaStudioModule запускается как подпроцесс

- **Файл:** `/home/dex/Документы/Work/liteend/src/dev-tools/prisma-studio/prisma-studio.service.ts`
- **Суть:** `startStudio()` вызывает `exec('npm run db:studio')`, который запускает `prisma studio` как отдельный процесс на порту 5555. Контроллер проксирует запросы на localhost:5555. Это запускает `npx prisma studio` прямо из NestJS runtime, что добавляет значительную сложность (прокси, аутентификация, управление подпроцессом).
- **Уверенность:** 85%
- **Решение:** Рассмотреть альтернативы: запускать `prisma studio` отдельно через Docker Compose (как это сделано для pgAdmin/Redis Commander), а не через подпроцесс NestJS.

#### 4. `AppController` — ручной catch-all для 404

- **Файл:** `/home/dex/Документы/Work/liteend/src/app.controller.ts`
- **Суть:** `@All()` хендлер, который выбрасывает `NotFoundException` для корневого `/`. NestJS и Fastify по умолчанию возвращают 404 для незарегистрированных маршрутов, что делает этот контроллер избыточным.
- **Уверенность:** 90%
- **Решение:** Удалить `AppController`, если нет планов добавлять корневой маршрут с осмысленным ответом.

#### 5. `DebugResolver` экспортирует `testTranslation` и `echo` методы

- **Файл:** `/home/dex/Документы/Work/liteend/src/dev-tools/debug/debug.resolver.ts`
- **Суть:** Query `echo` и `testTranslation`, а также mutation `echo` — это вспомогательные методы для отладки, которые не несут бизнес-ценности. Их наличие в продакшен-GraphQL добавляет шум в схему.
- **Уверенность:** 60%
- **Решение:** Оставить (полезно для dev), или скрыть за feature flag.

---

## Audit Coverage

| Компонент | Файлов прочитано | Статус |
|-----------|------------------|--------|
| `src/common/auth/*.ts` | 6 | :white_check_mark: |
| `src/modules/file-upload/*.ts` | 3 | :white_check_mark: |
| `src/modules/profile/*.ts` + types | 6 | :white_check_mark: |
| `src/bootstrap/setup-app.ts` | 1 | :white_check_mark: |
| `src/common/graphql/*.ts` | 1 | :white_check_mark: |
| `src/common/prisma/*.ts` | 2 | :white_check_mark: |
| `src/infrastructure/test-queue/*.ts` | 3 | :white_check_mark: |
| `src/main.ts` | 1 | :white_check_mark: |
| `src/app.module.ts` | 1 | :white_check_mark: |
| `src/common/all-exceptions-filter.ts` | 1 | :white_check_mark: |
| `src/common/dotenv-validator/*.ts` | 2 | :white_check_mark: |
| `src/common/logger/*.ts` | 3 | :white_check_mark: |
| `src/common/real-ip/*.ts` | 1 | :white_check_mark: |
| `src/common/redis/*.ts` | 2 | :white_check_mark: |
| `src/dev-tools/*/*.ts` | 10 | :white_check_mark: |
| `src/db-backup-tool/*.ts` | 3 | :white_check_mark: |
| `src/infrastructure/health/*.ts` | 3 | :white_check_mark: |
| `test/utils/mocks.ts` | 1 | :white_check_mark: |
| `test/utils/testing-app.ts` | 1 | :white_check_mark: |
| `test/utils/e2e-client.ts` | 1 | :white_check_mark: |
| **Total** | **52 файла** | |

### Инструменты

- **knip**: `npx knip --reporter json` — для поиска dead exports, неиспользуемых зависимостей
- **grep**: регекс-поиск в содержимом файлов
- **glob**: поиск по файловым паттернам
- **Read**: чтение содержимого файлов

---

## Итог

| Категория | Найдено | Критичность |
|-----------|---------|-------------|
| Dead code | 8 | Средняя |
| Неоправданные абстракции | 3 | Низкая |
| Feature flags | 0 | — |
| Технический долг | 1 | Низкая |
| Over-engineering | 5 | Средняя |

**Всего: 17 находок.** Рекомендуется начать с исправления dead code (YAGNI-02) и проверки TODO (YAGNI-05), затем пересмотреть over-engineering точки (TestQueueModule, PrismaStudioModule).

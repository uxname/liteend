# Audit Report: Over-engineering & YAGNI — 2026-05-22 11:43

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| YAGNI-01 | Нет закомментированного кода | ✅ PASS | High | `src/` — найдены только biome-ignore, jsdoc, и заголовки сгенерированных файлов. Закомментированного кода нет. | — | — |
| YAGNI-02 | Нет dead code — неиспользуемых зависимостей | ❌ FAIL 🟡 | High | `package.json:70-71` — **`class-transformer`** и **`class-validator`** не импортируются нигде в `src/`. Используется `nestjs-zod`. | **1. Удалить обе зависимости из package.json** \\ 2. Оставить `class-validator` если планируется миграция с zod \\ 3. Оставить, задокументировать причину | Нет |
| YAGNI-02 | Нет dead code — неиспользуемых зависимостей | ❌ FAIL 🟢 | High | `package.json:65` — **`@nestjs/websockets`** не импортируется нигде в `src/`. | **1. Удалить зависимость** \\ 2. Оставить для будущих WebSocket подписок GraphQL (задокументировать) \\ 3. — | Нет |
| YAGNI-02 | Нет dead code — неиспользуемых зависимостей | ❌ FAIL 🟢 | Medium | `package.json:76` — **`graphql-ws`** не импортируется. Уже добавлен в `ignoreDependencies` в `knip.json:10`. | **1. Удалить зависимость** \\ 2. Оставить если планируются GraphQL subscriptions через WebSocket \\ 3. — | Нет |
| YAGNI-02 | Нет dead code — дублированный интерфейс | ❌ FAIL 🟢 | High | `src/common/git-commit-saver.ts:11` и `src/dev-tools/debug/debug.resolver.ts:18` — **`CommitInfo`** описан дважды с одинаковой структурой. | **1. Вынести `CommitInfo` в общий файл `src/common/`** \\ 2. Импортировать интерфейс из `git-commit-saver.ts` в debug.resolver \\ 3. Оставить как есть (низкий приоритет) | Нет |
| YAGNI-03 | Абстракции оправданы — RedisService тонкая обёртка | ❌ FAIL 🟢 | High | `src/common/redis/redis.service.ts` — **`RedisService`** только вызывает `getClient()`. Нет дополнительной логики, кэширования, повторных попыток. Используется в 2 местах (`AuthService`, `ProfileService`). | **1. Убрать RedisService, inject напрямую `ioredis` клиент как провайдер** \\ 2. Оставить как единую точку конфигурации Redis (документировать причину) \\ 3. Интегрировать с конфигом BullMQ для переиспользования пула | Нет |
| YAGNI-03 | Абстракции оправданы — PinoCustomProps | ❌ FAIL 🟢 | High | `src/common/logger/pino-config.ts:48` — **`PinoCustomProps`** объявлен и используется только в одном файле. | **1. Перенести определение типа внутрь файла (inline type)** \\ 2. Экспортировать если потребуется в других частях системы \\ 3. — | Нет |
| YAGNI-03 | Абстракции оправданы — HttpExceptionResponse | ❌ FAIL 🟢 | High | `src/common/all-exceptions-filter.ts:23` — **`HttpExceptionResponse`** используется один раз в строке 155 того же файла. | **1. Inline тип** \\ 2. Использовать встроенный `exception.getResponse()` без каста \\ 3. — | Нет |
| YAGNI-03 | Абстракции оправданы — дублированный EnvironmentVariables | ❌ FAIL 🟢 | High | `src/db-backup-tool/backup.ts:9` и `src/db-backup-tool/restore.ts:9` — **`EnvironmentVariables`** описан дважды с одинаковыми полями. | **1. Вынести в общий файл `src/db-backup-tool/env.ts`** \\ 2. Импортировать из backup.ts/restore.ts \\ 3. — | Нет |
| YAGNI-04 | Feature flags не зафиксированы — enableVersioning | ❌ FAIL 🟡 | High | `src/main.ts:41` — **`app.enableVersioning()`** вызван, но ни один контроллер/resolver не использует `@Version()`. Подготовка к версионированию API, которое не реализовано. | **1. Удалить `app.enableVersioning()` пока нет версионированных роутов** \\ 2. Оставить с комментарием о планах версионирования \\ 3. Внедрить verisoning если REST API будет расширяться | Нет |
| YAGNI-04 | Feature flags не зафиксированы — i18n переусложнён | ❌ FAIL 🟡 | High | `src/app.module.ts:112-126` — **`I18nModule.forRoot`** с 2 языками (en, ru), файловой системой, AcceptLanguageResolver, watcher, генерацией типов. Используется только в `debug.resolver.ts:49-62` для `testTranslation` — dev-утилиты. | **1. Удалить i18n, заменить testTranslation на обычный возврат строки** \\ 2. Оставить i18n под production-i18n (реальные переводы), но отвязать от dev-резолвера \\ 3. Условно загружать i18n только когда `NODE_ENV=production` | Нет |
| YAGNI-04 | Feature flags не зафиксированы — dev-модули в production | ❌ FAIL 🟡 | Medium | `src/app.module.ts:34-35, 75-81` — **DevLauncherModule, LoggerServeModule, PrismaStudioModule, DebugModule, TestQueueModule** грузятся безусловно. В production это лишняя поверхность атаки и потребление ресурсов. | **1. Условный импорт: `NODE_ENV !== 'production'`** \\ 2. Вынести dev-модули в отдельный модуль, загружать по флагу `DEV_TOOLS_ENABLED` \\ 3. Оба варианта выше + динамический DynamicModule | Нет |
| YAGNI-05 | Технический долг актуален — TODO | ✅ PASS | High | `src/common/prisma/prisma.service.ts:35` — Единственный TODO(#1) со ссылкой на issue. Не старше 6 месяцев? Актуален для текущей версии Prisma. | — | — |

## Audit Coverage

**Проверено:** `src/**/*.ts` (все исходники), `test/**/*.ts`, `package.json`, `knip.json`, `prisma/schema.prisma` (бегло)

**Пропущено:** `node_modules/`, `dist/`, `coverage/`, `.git/`, `docs/`, `assets/`

Файлов проверено: ~55 | Пропущено: N/A

## Итог

- **YAGNI-01 (закомментированный код)**: ✅ PASS
- **YAGNI-02 (dead code)**: ❌ FAIL — 4 замечания (1 🟡, 3 🟢)
- **YAGNI-03 (абстракции)**: ❌ FAIL — 4 замечания (все 🟢)
- **YAGNI-04 (feature flags / спекулятивность)**: ❌ FAIL — 3 замечания (все 🟡)
- **YAGNI-05 (техдолг)**: ✅ PASS

**Критических нарушений нет.** Основные проблемы:
1. **Мёртвые зависимости** (`class-transformer`, `class-validator`, `@nestjs/websockets`, `graphql-ws`) — удалить 4 пакета из package.json.
2. **Dev-модули в production** — 5 модулей загружаются безусловно, хотя нужны только в разработке.
3. **Спекулятивное версионирование API** — `enableVersioning()` без единого использования.
4. **i18n переусложнён** — полная интернационализация ради одного hello-world теста в dev-резолвере.

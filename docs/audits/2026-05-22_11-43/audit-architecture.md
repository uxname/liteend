# Audit Report: Architecture & File Structure — 2026-05-22 11:43

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| ARC-01 | Бизнес-логика вынесена из route handlers в service/domain слой | ✅ PASS | High | `file-upload.controller.ts` — делегирует в `FileUploadService`; `profile.resolver.ts` — делегирует в `ProfileService` | — | — |
| ARC-02 | Presentation layer не взаимодействует с БД напрямую | ✅ PASS | High | Ни один контроллер/resolver не вызывает Prisma напрямую | — | — |
| ARC-03 | Нет circular dependencies между модулями | ✅ PASS | High | Граф зависимостей прямой: feature → common → global; нет циклов | — | — |
| ARC-04 | Нет god-объектов: файлы и классы имеют единственную ответственность | ✅ PASS | High | Макс. размер source-файла без учёта generated: `pino-config.ts` 200 строк; все классы имеют 1 ответственность | — | — |
| ARC-05 | Конфигурация и env-переменные изолированы в config-модуле | ⏸ ACCEPTED | Medium | `setup-app.ts:93` использует `process.env.CORS_ORIGIN` напрямую; `pino-config.ts:10-11` — `process.env.NODE_ENV`; но это bootstrap/config-файлы, где доступ к ConfigService ограничен | — | — |
| ARC-06 | Внешние зависимости инжектируются (DI), не импортируются напрямую | ✅ PASS | High | PrismaService, RedisService, ConfigService — все через DI в конструкторах | — | — |
| ARC-07 | Доменный слой не импортирует инфраструктурные модули | ❌ FAIL 🟡 | High | `src/common/auth/jwt.strategy.ts:7` — импорт `Profile` из `@/modules/profile/types/profile.object-type` | **1. Вынести Profile type в @/common/types** \\ 2. Использовать Prisma-генерированный тип Profile из `@/@generated/prisma/client` в JwtStrategy \\ 3. Оставить, но добавить barrel-реэкспорт через `@/common` | Нет |

## Дополнительные находки

### ARCH-08: FileUploadModule — некорректная конфигурация
- **Статус**: ❌ FAIL 🟡 → ✅ FIXED
- **Файл**: `src/modules/file-upload/file-upload.module.ts:8`
- **Описание**: `FileUploadController` указан одновременно в `providers` и `controllers`. В NestJS контроллеры должны быть только в `controllers`. Наличие в `providers` может привести к двойной инициализации или некорректному поведению.
- **Решение**: Удалить `FileUploadController` из `providers: [FileUploadController, FileUploadService]`, оставить только `controllers: [FileUploadController]`.
- **Исправлено**: Да

### ARCH-09: FileUploadModule экспортирует контроллер
- **Статус**: ❌ FAIL 🟢
- **Файл**: `src/modules/file-upload/file-upload.module.ts:10`
- **Описание**: `exports: [FileUploadController]` — экспорт контроллера не нужен. Контроллеры обрабатывают HTTP-маршруты и не должны использоваться другими модулями как класс.
- **Решение**: Удалить `exports: [FileUploadController]` или, если нужна функциональность, экспортировать сервис.
- **Исправлено**: Да

### ARCH-10: Импорт package.json относительным путём
- **Статус**: ❌ FAIL 🟢
- **Файлы**: 
  - `src/bootstrap/setup-app.ts:15` — `import packageJson from '../../package.json'`
  - `src/common/logger/pino-config.ts:6` — `import packageJson from '../../../package.json'`
  - `src/dev-tools/debug/debug.resolver.ts:16` — `import packageJson from '../../../package.json'`
- **Описание**: `package.json` находится вне `src/`, поэтому `@/` алиас не работает. Однако эти импорты используют глубокую относительную навигацию (`../../../`), что хрупко при реструктуризации папок.
- **Предложение**: Вынести получение имени/версии приложения в отдельный сервис/константу в `@/common/` или добавить `@root/` алиас в tsconfig.
- **Исправлено**: Нет

### ARCH-11: Импорты test/utils через относительные пути
- **Статус**: ⏸ ACCEPTED
- **Файлы**: 11 spec-файлов используют `../../../test/utils/mocks` и подобные относительные пути
- **Описание**: `test/` находится вне `src/`, поэтому `@/` алиас не работает. Это известное ограничение — spec-файлы вынуждены использовать относительные пути к `test/utils/`.
- **Решение**: Принято как есть — тесты не входят в `src/`.

### ARCH-12: AuthService возвращает Prisma Profile, JwtStrategy ожидает GraphQL Profile
- **Статус**: ❌ FAIL 🟡
- **Файл**: `src/common/auth/jwt.strategy.ts:7,43`
- **Описание**: `JwtStrategy.validate()` возвращает `Promise<Profile>`, где `Profile` — GraphQL ObjectType из `@/modules/profile/types/profile.object-type`. Но `AuthService.findOrCreateProfile()` возвращает Prisma-генерированный `Profile` из `@/@generated/prisma/client`. Типы структурно совместимы, но семантически это разные сущности. Это может привести к ошибкам, если GraphQL ObjectType и Prisma модель разойдутся.
- **Решение**: В `JwtStrategy` использовать Prisma-генерированный тип `Profile` из `@/@generated/prisma/client` или определить интерфейс в `common/auth/types.ts`.
- **Исправлено**: Нет

### ARCH-13: ProfileModule экспортирует ProfileService, который никем не используется
- **Статус**: ❌ FAIL 🟢
- **Файл**: `src/modules/profile/profile.module.ts:9`
- **Описание**: `exports: [ProfileService]` — сервис экспортируется, но ни один другой модуль его не импортирует. `AuthService` работает с профилями напрямую через `PrismaService`, не используя `ProfileService`.
- **Решение**: Удалить `exports: [ProfileService]` или добавить документацию, почему экспорт нужен для будущего использования.
- **Исправлено**: Да

### ARCH-14: DebugResolver — бизнес-логика в presentation слое
- **Статус**: ❌ FAIL 🟢
- **Файл**: `src/dev-tools/debug/debug.resolver.ts:84-127`
- **Описание**: `debug()` query содержит расчёт uptime, чтение commit-info, получение memory usage. Это утилитарная/dev-логика, но расположена прямо в Resolver без выделенного сервиса.
- **Решение**: Вынести логику в `DebugService`.
- **Исправлено**: Нет

## Структура папок — общая оценка

```
src/
├── @generated/        — Prisma и i18n codegen (OK)
├── bootstrap/         — Настройка приложения (OK)
├── common/            — Общие модули (auth, prisma, redis, logger, graphql, real-ip)
├── dev-tools/         — Инструменты разработки (bull-board, debug, dev-launcher, logger-serve, prisma-studio)
├── infrastructure/    — Инфраструктура (health, test-queue)
├── modules/           — Бизнес-модули (file-upload, profile)
├── db-backup-tool/    — Отдельный инструмент бэкапа БД
└── i18n/              — Локализация
```

**Оценка**: Структура следует NestJS-конвенциям. Разделение на feature modules (`modules/`), common (`common/`), infrastructure (`infrastructure/`) и dev-tools (`dev-tools/`) логично. Feature modules изолированы и не импортируют друг друга напрямую.

## Import alias usage (`@/`)

- ✅ Production-код использует `@/` алиас последовательно
- ❌ Тесты и package.json импорты используют относительные пути (оправдано расположением вне `src/`)

## Audit Coverage

**Проверено**: `src/modules/**, src/common/**, src/infrastructure/**, src/bootstrap/**, src/dev-tools/**`

**Пропущено**: `src/@generated/**, src/db-backup-tool/**, test/**`

**Файлов проверено**: ~70 source + spec | **Пропущено**: ~30 generated + test utils

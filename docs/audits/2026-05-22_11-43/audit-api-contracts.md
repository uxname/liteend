# Audit Report: API Contracts — 2026-05-22 11:43

## Резюме

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| API-01 | Форма ответов консистентна — единый envelope или его отсутствие по всему API | ❌ FAIL 🟡 | High | `src/dev-tools/logger-serve/logger-serve.controller.ts:59` — возвращает `{ error: 'Unable to list files' }` (без `statusCode`, `requestId`, `timestamp`) | **1. Перевести LoggerServeController на глобальный AllExceptionsFilter — выбрасывать HttpException вместо ручного response.send()** \\ 2. Убрать прямой response.send() в catch-блоках и дать исключению всплыть в global filter \\ 3. Оставить как есть, но добавить документацию, что dev-tools используют упрощённый формат | Нет |
| API-02 | HTTP статус-коды семантически корректны (201 при создании, 4xx для client errors) | ❌ FAIL 🟠 | High | `src/modules/file-upload/file-upload.controller.ts:49` — `@ApiResponse({ status: 200, ... })` но фактический код 201 (`@HttpCode(HttpStatus.CREATED)` в строке 32). `src/dev-tools/logger-serve/logger-serve.controller.ts:58` — статус 500 для «Unable to list files» (клиентская ошибка, должен быть 4xx) | **1. Исправить @ApiResponse({ status: 201 }) в file-upload.controller.ts** \\ 2. Изменить статус ошибки в logger-serve.controller.ts на 404 или 500 в зависимости от типа ошибки (сейчас всегда 500) \\ 3. Вынести обработку ошибок логов в middleware | Нет |
| API-03 | Error responses машиночитаемы и консистентны по структуре | ❌ FAIL 🟡 | High | `src/dev-tools/logger-serve/logger-serve.controller.ts:83` — `response.code(HttpStatus.FORBIDDEN).send('Access denied')` — плоский текст вместо JSON. `:93` — `'Is a directory'` (plain text). `:125` — `'File not found'` (plain text). `:59` — `{ error: 'Unable to list files' }` без `statusCode`, `requestId`, `timestamp` | **1. Заменить все прямые response.send(text) на throw new HttpException(text, status)** \\ 2. Создать единый helper для ошибок в dev-tools \\ 3. Сделать LoggerServeController совместимым с AllExceptionsFilter | Нет |
| API-04 | Именование полей консистентно (camelCase или snake_case, не смешано) | ✅ PASS | High | Все REST и GraphQL ответы используют camelCase: `statusCode`, `requestId`, `avatarUrl`, `createdAt`, `updatedAt`, `originalFilename`. Проверены: `file-upload.controller.ts`, `error-formatter.ts`, `all-exceptions-filter.ts`, `profile.object-type.ts` | — | — |
| API-05 | Stack trace и внутренние детали не попадают в error responses | ✅ PASS | High | `src/common/all-exceptions-filter.ts:168-172` — для Internal Server Error возвращает `'An unexpected error occurred'` без стека. `src/common/graphql/error-formatter.ts:118-126` — GraphQL ошибки также скрывают детали | — | — |
| API-06 | Пагинация включает метаданные (total/hasNext) где применима | ⏸ ACCEPTED | — | Пагинация не реализована ни в одном endpoint'е. На данном этапе развития API — отсутствует необходимость. | — | — |
| API-07 | Публичный API имеет стратегию версионирования | ❌ FAIL 🟡 | High | `src/main.ts:41` — `app.enableVersioning()` вызван без параметров. Ни один контроллер не использует `@Controller({ version: '1' })`. Версионирование включено, но не настроено — все роуты живут без версии | **1. Настроить `app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })` и добавить `@Version('1')` на все контроллеры** \\ 2. Определить стратегию версионирования (URI / header) и зафиксировать в CONTRIBUTING.md \\ 3. Пока API внутренний — убрать `enableVersioning()` до появления внешних клиентов | Нет |

## Детали найденных проблем

### API-01 / API-03: Нестандартный формат ошибок в LoggerServeController

`src/dev-tools/logger-serve/logger-serve.controller.ts:59`
```ts
response.code(HttpStatus.INTERNAL_SERVER_ERROR)
  .send({ error: 'Unable to list files' });
```

`src/dev-tools/logger-serve/logger-serve.controller.ts:83`
```ts
response.code(HttpStatus.FORBIDDEN).send('Access denied');
```

Весь остальной API использует глобальный `AllExceptionsFilter` со стандартным форматом:
```json
{
  "statusCode": 403,
  "timestamp": "2026-05-22T11:43:00.000Z",
  "requestId": "req-xxx",
  "error": "ForbiddenException",
  "message": "Access denied"
}
```

LoggerServeController отправляет ответ напрямую через `@Res()`, минуя глобальный фильтр.
Это приводит к **двум разным форматам ошибок** в одном API.

### API-02: Несоответствие Swagger и фактического HTTP-статуса

`src/modules/file-upload/file-upload.controller.ts:32,49`
```ts
@HttpCode(HttpStatus.CREATED)        // 201
@ApiResponse({ status: 200, ... })   // написано 200 — неверно!
```

Документация Swagger обещает `200 OK`, а сервер отвечает `201 Created`. Клиенты, сгенерированные по Swagger, будут ожидать 200.

### API-07: Версионирование без стратегии

`src/main.ts:41`
```ts
app.enableVersioning();
```

NestJS `enableVersioning()` без конфигурации не применяет версию по умолчанию. Ни один контроллер не аннотирован `@Version()`. Фактически — мёртвый код.

## What was checked

- Все 3 REST-контроллера: FileUploadController, HealthController, DevLauncherController, LoggerServeController, PrismaStudioController
- Все 3 GraphQL-резолвера: ProfileResolver, DebugResolver, TestQueueResolver
- Глобальный AllExceptionsFilter + spec
- GraphQL error formatter + spec
- Настройка Swagger/OpenAPI
- Конфигурация версионирования
- Все типы GraphQL (Profile, ProfileUpdateInput, ProfileRole)

## Audit Coverage

Проверено: `src/**/*.controller.ts`, `src/**/*.resolver.ts`, `src/common/all-exceptions-filter.ts`, `src/common/graphql/error-formatter.ts`, `src/bootstrap/setup-app.ts`, `src/main.ts`, `src/modules/profile/types/*`, `src/common/constants.ts`

Пропущено: `test/**`, `src/@generated/**`, `node_modules/**`

Файлов проверено: 14 | Пропущено: ~50 (тесты, генерация, миграции)

## Итог

- ✅ Пройдено: 3 (API-04, API-05, API-06)
- ❌ Нарушений: 4 (API-01, API-02, API-03, API-07)
- ⏸ Принято: 1 (API-06 — пагинация не требуется)

# Audit Report: API Contracts — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| CON-01 | GraphQL схемы имеют описание/дескрипшены для всех типов и полей | FAIL | HIGH | Из 14 GraphQL элементов (типы, поля, аргументы, операции) только 1 имеет описание: `addTestJob` mutation (`{ description: 'Adds a job to the test queue' }`). Остальные 13 не имеют дескрипшенов: `Profile` ObjectType (5 полей без описаний: id, createdAt, updatedAt, roles, avatarUrl), `ProfileUpdateInput` InputType (1 поле avatarUrl без описания), enum `ProfileRole` (описание явно `undefined`), резолверы `me`, `updateProfile`, `profileUpdated`, `echo` (query), `echo` (mutation), `testTranslation`, `debug` — ни у одного нет `description`. | Добавить `description` в каждый `@ObjectType`, `@Field`, `@InputType`, `@Query`, `@Mutation`, `@Subscription` и `registerEnumType`. | ✅ Да |
| CON-02 | REST responses имеют консистентную структуру (успех/ошибка/пагинация) | PARTIAL | HIGH | **Успех**: несогласован — `POST /upload` возвращает `Array<{filename, path}>` без envelope; `GET /uploads/*` возвращает raw stream; `GET /health` возвращает `HealthCheckResult` (терминус); `GET /logs/api/list` возвращает `string[]`; `GET /dev` возвращает HTML. **Ошибки**: согласованы — `AllExceptionsFilter.buildErrorBody()` выдаёт единый формат `{statusCode, timestamp, requestId, error, message, details?}`. **Пагинация**: отсутствует во всех эндпоинтах. | Обернуть успешные REST ответы в единый envelope (например, `{data, meta}`). | НЕТ |
| CON-03 | HTTP статус-коды соответствуют семантике операции (201 создание, 204 удаление) | FAIL | HIGH | **`POST /upload` (file-upload.controller.ts:29)**: возвращает `200 OK` при успешном создании файла — должен возвращать `201 Created`. Остальные: `GET /uploads/*` → 200 (OK), `GET /health` → 200 (OK), `GET /dev` → 200 (OK), `GET /logs/api/list` → 200 (OK). DELETE эндпоинтов нет. Error mapping в `AllExceptionsFilter` корректен. | Изменить статус `POST /upload` на `201 Created` с помощью `@HttpCode(HttpStatus.CREATED)`. Возвращать `Location` header с URL загруженного файла. | ✅ Да |
| CON-04 | Версионирование API спланировано или реализовано | FAIL | HIGH | В `main.ts` (src/main.ts) нет `app.enableVersioning()`. Нет `app.setGlobalPrefix()`. Ни один REST маршрут не содержит префикса версии (`/v1/`, `/v2/`). В `setup-app.ts` Swagger использует `packageJson.version` только как метаданные документации (строка), а не для URL-версионирования. GraphQL-схема также не версионирована. | Внедрить стратегию версионирования: URI-based (`app.setGlobalPrefix('v1')` + `app.enableVersioning()`) или Header-based. Задокументировать в ADR. | НЕТ |
| CON-05 | GraphQL error responses имеют machine-readable code (не только message) | PASS | HIGH | `gqlErrorFormatter` (src/common/graphql/error-formatter.ts) всегда добавляет `extensions.code` с одним из: `BAD_USER_INPUT`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`. Дополнительно: `extensions.requestId` и `extensions.details` (для validation errors). Написаны unit-тесты (error-formatter.spec.ts) покрывающие все сценарии. | Нет необходимости — стандарт соблюдён. | ДА |
| CON-06 | REST ошибки следуют единой схеме RFC 7807 (Problem Details) или кастомному стандарту | PARTIAL | HIGH | `AllExceptionsFilter` (src/common/all-exceptions-filter.ts:121-164) формирует единый custom формат: `{statusCode, timestamp, requestId, error, message, details?}`. Стандарт соблюдён **внутри проекта**, но **НЕ соответствует RFC 7807** (не хватает обязательных полей: `type` (URI), `title`, `detail`, `instance`). | Опционально: расширить error body до RFC 7807, добавив поля `type`, `title`, `detail`, `instance`. Либо задокументировать текущий custom стандарт как корпоративный. | НЕТ |
| CON-07 | Спецификация API (OpenAPI/SDL) соответствует реализации | PARTIAL | HIGH | **OpenAPI/Swagger**: Настроен в `setup-app.ts` (строка 49-56), доступен по `/swagger`. `FileUploadController` полностью документирован: `@ApiBearerAuth`, `@ApiConsumes`, `@ApiBody`, `@ApiOperation`, `@ApiResponse`, `@ApiParam`. `AppController.root()` корректно исключён (`@ApiExcludeEndpoint`). Остальные REST-контроллеры (`HealthController`, `DevLauncherController`, `LoggerServeController`, `PrismaStudioController`) **НЕ имеют** OpenAPI-декораторов. **GraphQL SDL**: Генерируется автоматически (`autoSchemaFile: true` в app.module.ts:42), code-first — всегда соответствует реализации. | Добавить `@ApiTags`, `@ApiOperation`, `@ApiResponse` на Health, DevLauncher, LoggerServe и другие REST-контроллеры. | НЕТ |
| CON-08 | Pagination использует cursor-based для списков (не offset-based) | N/A | HIGH | В кодовой базе **нет ни одного эндпоинта, возвращающего список** (list query/endpoint). GraphQL резолверы: `me` — единичный объект, `updateProfile` — единичный объект, `echo` — скаляр, `testTranslation` — скаляр, `addTestJob` — Boolean, `debug` — JSON. REST: все эндпоинты возвращают либо единичный объект, либо stream, либо HTML. Не к чему применять проверку. | При добавлении list-endpoints немедленно внедрить cursor-based пагинацию (Relay Connections spec) через `@nestjs/graphql` `ConnectionType`, `PageInfo`, `Edge`. | ДА (N/A) |

## Audit Coverage

| Элемент | Файл | Проверки |
|---------|------|----------|
| AppController | `/home/dex/Документы/Work/liteend/src/app.controller.ts` | CON-02, CON-04, CON-07 |
| ProfileResolver | `/home/dex/Документы/Work/liteend/src/modules/profile/profile.resolver.ts` | CON-01, CON-05, CON-08 |
| ProfileModule | `/home/dex/Документы/Work/liteend/src/modules/profile/profile.module.ts` | CON-01 |
| Profile ObjectType | `/home/dex/Документы/Work/liteend/src/modules/profile/types/profile.object-type.ts` | CON-01 |
| ProfileUpdateInput | `/home/dex/Документы/Work/liteend/src/modules/profile/types/profile-update.input.ts` | CON-01 |
| ProfileRole enum | `/home/dex/Документы/Work/liteend/src/modules/profile/types/profile-role.enum.ts` | CON-01 |
| ProfileService | `/home/dex/Документы/Work/liteend/src/modules/profile/profile.service.ts` | CON-08 |
| FileUploadController | `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.controller.ts` | CON-02, CON-03, CON-07 |
| FileUploadModule | `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.module.ts` | CON-07 |
| FileUploadService | `/home/dex/Документы/Work/liteend/src/modules/file-upload/file-upload.service.ts` | CON-03 |
| GraphQL error-formatter | `/home/dex/Документы/Work/liteend/src/common/graphql/error-formatter.ts` | CON-05 |
| GraphQL error-formatter spec | `/home/dex/Документы/Work/liteend/src/common/graphql/error-formatter.spec.ts` | CON-05 |
| AllExceptionsFilter | `/home/dex/Документы/Work/liteend/src/common/all-exceptions-filter.ts` | CON-02, CON-03, CON-06 |
| TestQueueResolver | `/home/dex/Документы/Work/liteend/src/infrastructure/test-queue/test-queue.resolver.ts` | CON-01, CON-08 |
| DebugResolver | `/home/dex/Документы/Work/liteend/src/dev-tools/debug/debug.resolver.ts` | CON-01, CON-08 |
| DebugModule | `/home/dex/Документы/Work/liteend/src/dev-tools/debug/debug.module.ts` | CON-01 |
| HealthController | `/home/dex/Документы/Work/liteend/src/infrastructure/health/health.controller.ts` | CON-02, CON-04, CON-07 |
| LoggerServeController | `/home/dex/Документы/Work/liteend/src/dev-tools/logger-serve/logger-serve.controller.ts` | CON-02, CON-04, CON-07 |
| DevLauncherController | `/home/dex/Документы/Work/liteend/src/dev-tools/dev-launcher/dev-launcher.controller.ts` | CON-02, CON-04, CON-07 |
| PrismaStudioController | `/home/dex/Документы/Work/liteend/src/dev-tools/prisma-studio/prisma-studio.controller.ts` | CON-07 |
| AppModule (GraphQL config) | `/home/dex/Документы/Work/liteend/src/app.module.ts` | CON-01, CON-05 |
| setup-app bootstrap | `/home/dex/Документы/Work/liteend/src/bootstrap/setup-app.ts` | CON-04, CON-07 |
| main.ts | `/home/dex/Документы/Work/liteend/src/main.ts` | CON-04 |
| Prisma Schema | `/home/dex/Документы/Work/liteend/prisma/schema.prisma` | CON-01 |
| Generated Prisma types | `/home/dex/Документы/Work/liteend/src/@generated/prisma/` | CON-01 |
| GqlLoggingInterceptor | `/home/dex/Документы/Work/liteend/src/common/logger/gql-logging.interceptor.ts` | CON-05 |
| RolesDecorator | `/home/dex/Документы/Work/liteend/src/common/auth/roles.decorator.ts` | CON-01 |

## Summary

| Статус | Количество |
|--------|-----------|
| PASS | 1 (CON-05) |
| PARTIAL | 3 (CON-02, CON-06, CON-07) |
| FAIL | 3 (CON-01, CON-03, CON-04) |
| N/A | 1 (CON-08) |

## Ключевые находки

1. **CON-01 (FAIL):** Из 14 GraphQL-элементов (ObjectType, InputType, поля, enum, query, mutation, subscription) только у 1 (`addTestJob`) есть `description`. Это затрудняет автогенерацию документации и Auto-complete в IDE/Altair. В GraphQL code-first режиме `description` обязателен для Schema Description Language (SDL).

2. **CON-03 (FAIL):** `POST /upload` возвращает `200 OK` вместо `201 Created`. Нарушение принципа REST — операция создаёт новый ресурс (запись в БД + файл на диске).

3. **CON-04 (FAIL):** API полностью не версионирован. Риск: breaking changes в будущем сломают клиентов без предупреждения.

4. **CON-07 (PARTIAL):** OpenAPI/Swagger покрыт только `FileUploadController` (самый критичный). Остальные REST-контроллеры не задокументированы. GraphQL SDL генерируется автоматически и соответствует реализации.

5. **CON-08 (N/A):** В текущей кодовой базе нет list-эндпоинтов, поэтому проверка не применима. При добавлении списков — использовать Relay Cursor Connections.

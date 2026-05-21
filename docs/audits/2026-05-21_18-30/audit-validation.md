# Audit Report: Boundary Data Validation — 2026-05-21 18:30

## Methodology

- **Codebase**: NestJS + TypeScript + Prisma + GraphQL (Mercurius) + Fastify
- **Validation Framework**: `nestjs-zod` ^5.3.0 + `zod` ^4.4.3
- **Global Pipe**: `ZodValidationPipe` registered via `app.useGlobalPipes(new ZodValidationPipe())` in `setup-app.ts`
- **Audit scope**: All REST controllers, GraphQL resolvers, auth guards, file upload, prisma integration
- **Files examined**: 30+ source files across `src/`, plus Prisma schema and config

---

## Summary Matrix

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| VAL-01 | Все входящие данные (body, params, query) проходят schema-валидацию | **FAIL** | Высокая | 5 REST endpoints + 3 GraphQL resolvers без ZodDto | См. VAL-01.details | Нет |
| VAL-02 | Строки имеют maxLength, числа — диапазон, enum-значения — whitelist | **FAIL** | Высокая | Единственная схема `ProfileUpdateSchema` не содержит `.max()`/`.min()` | См. VAL-02.details | Нет |
| VAL-03 | JSON.parse обёрнут в try/catch с последующей валидацией структуры | **PASS** | Высокая | Все 3 вызова JSON.parse в try/catch, ни один не обрабатывает user input | — | — |
| VAL-04 | Identity данные берутся из аутентифицированного контекста (не из user input) | **PASS** | Высокая | `@CurrentUser()` читает `request.user`, установленный JwtAuthGuard | Исключение: режим mock (см. VAL-04.note) | — |
| VAL-05 | Вложенные структуры и массивы ограничены (глубина, minItems/maxItems) | **FAIL** | Средняя | Ни одна схема Zod не использует `.min()`, `.max()`, `.length()` | См. VAL-05.details | Нет |
| VAL-06 | Валидатор не выполняет неявный coercion | **PASS** | Высокая | `ZodValidationPipe` использует `z.parse()` (strict). `.coerce()`/`.transform()` не найдены | GraphQL scalar coercion — по дизайну | — |
| VAL-07 | Prototype pollution: merge/assign с user input фильтрует __proto__, constructor, prototype | **PASS** | Высокая | Ни одного user-controlled `Object.assign`/merge/spread кроме Prisma | См. VAL-07.details | — |
| VAL-08 | Загрузка файлов: MIME тип проверяется по содержимому, имя санитизировано, размер ограничен | **PARTIAL** | Высокая | MIME — по заголовку (не по содержимому), путь — безопасен, размер — не ограничен | См. VAL-08.details | Нет |

---

## Detailed Findings

### VAL-01.details — Входящие данные без schema-валидации

**REST endpoints без ZodDto:**

| Эндпоинт | Файл | Проблема |
|----------|------|----------|
| `POST /upload` | `file-upload.controller.ts:49` | `@Req() req: FastifyRequest` — прямое чтение request, без DTO. Multipart части обрабатываются вручную |
| `GET /uploads/*` | `file-upload.controller.ts:84` | `@Param('*') filePathParam: string` — никакой валидации, raw string |
| `ALL /studio/*, /bff/*, ...` | `prisma-studio.controller.ts:43` | `@Body() body: unknown` — сырой unknown, никакой схемы |
| `GET /logs/file/*` | `logger-serve.controller.ts:65-66` | `@Param('*') _filepath: string`, `@Query('start') startQuery: string` — без схем |
| `GET /` | `app.controller.ts:7` | `@All()` — не принимает данные (NotFoundException), ок |

**GraphQL resolvers без ZodDto:**

| Резолвер | Файл | Проблема |
|----------|------|----------|
| `echo(text: String!)` | `debug.resolver.ts:60` | `@Args('text', { type: () => String }) text: string` — scalar, не проходит через Zod |
| `echoMutation(text: String!)` | `debug.resolver.ts:66` | Аналогично |
| `addTestJob(message: String!)` | `test-queue.resolver.ts:11` | `@Args('message', { type: () => String }) message: string` — без Zod |
| `testTranslation(username: String!)` | `debug.resolver.ts:49` | `@Args('username', { type: () => String }) username: string` — без Zod |

**Общий механизм**: `ZodValidationPipe` срабатывает только если тип параметра — класс, унаследованный от `ZodDto`. Скалярные типы (`String`, `Int`) и plain `string`/`unknown` не валидируются.

### VAL-02.details — Отсутствие граничных ограничений

- **Единственная Zod-схема в кодовой базе** — `ProfileUpdateSchema` в `profile-update.input.ts`:
  ```ts
  const ProfileUpdateSchema = z.object({
    avatarUrl: z.url({ message: 'Avatar URL must be a valid URL' }).optional(),
  });
  ```
  - `avatarUrl`: только `z.url()`, БЕЗ `.max()`, `.min()`, `.trim()`.
  - Все остальные поля Profile (roles, oidcSub) не валидируются через Zod — они не принимаются как input, устанавливаются через JWT/Prisma.

- **Нигде в коде не используются**:
  - `z.string().max()`, `z.string().min()`
  - `z.number().min()`, `z.number().max()`
  - `z.array().min()`, `z.array().max()`
  - `z.enum()` (ProfileRole валидируется Prisma enum)

- **Prisma-side**: База данных имеет ограничения (например, `String` типы), но прикладной слой не проверяет длину до отправки в БД.

### VAL-03.details — JSON.parse в try/catch

| Файл | Строка | User input? | Валидация структуры? |
|------|--------|-------------|---------------------|
| `debug.resolver.ts` | 37 | Нет (читает локальный файл `last-commit-info.json`) | Нет, но результат возвращается как `CommitInfo | undefined` |
| `gql-logging.interceptor.ts` | 51 | Нет (парсит усечённый JSON внутренних данных) | Нет (используется только для логирования) |
| `logger-ui.html.ts` | 60 | Нет (браузерный код, парсит строки логов) | Нет (клиентский рендеринг) |

**Вердикт**: Все вызовы JSON.parse безопасны, ни один не обрабатывает пользовательский ввод.

### VAL-04.note — Identity из аутентифицированного контекста

- **`@CurrentUser()` декоратор** (`current-user.decorator.ts:7`): читает `request.user`, который устанавливается в `JwtAuthGuard.canActivate()`.
- **JWT стратегия** (`jwt.strategy.ts:43`): `validate()` возвращает `Profile` из Prisma по `payload.sub` — identity привязан к токену.
- **Исключение — Mock-режим** (`jwt-auth.guard.ts:35-66`): если `OIDC_MOCK_ENABLED=true`, identity берётся из:
  1. `x-mock-sub` header (user-controlled input!) — **потенциальная уязвимость** в production.
  2. Если header нет — fallback на `mock-oidc-sub` (всегда имеет ADMIN роль).

  **Рекомендация**: Mock-режим должен быть недоступен в production (проверка `NODE_ENV`).

- **Profile update** (`profile.resolver.ts:41`): `user.id` из `@CurrentUser()`, а `input.avatarUrl` — из графQL-аргумента. ID пользователя не может быть подменён.

### VAL-05.details — Отсутствие ограничений на массивы/вложенность

- Ни одна Zod-схема не содержит `z.array()` → нет нужды в `minItems`/`maxItems`.
- Нет вложенных Zod-схем.
- Однако отсутствие ограничений означает, что если в будущем добавится массивовый input, он останется без защиты от переполнения.
- В логгинг-интерцепторе есть `MAX_ARRAY_ELEMENTS = 5` для логирования — это не защита от входных данных.

### VAL-06.details — Отсутствие неявного coercion

- `ZodValidationPipe` из `nestjs-zod` использует `z.parse()` (strict mode).
- В коде не найдено ни одного вызова `.coerce()` или `.transform()`.
- GraphQL intrinsic coercion (например, `Int` может принимать строку "42" → число 42) — это особенность GraphQL спецификации, не контролируется Zod. Для защиты от этого нужно использовать Zod-схемы с кастомной валидацией.

**Вердикт**: На уровне приложения coercion отсутствует. GraphQL-level coercion — ожидаемое поведение.

### VAL-07.details — Prototype pollution

- **Не найдено** ни одного вызова `Object.assign()`, `_.merge()`, или spread-оператора с пользовательским вводом.
- `profile.service.ts:14`: `...input` — spread объекта `ProfileUpdateInput` (уже валидирован через Zod) в `prisma.profile.update()`. Prisma невосприимчива к prototype pollution через data-объекты.
- `jwt-auth.guard.ts:82`: `this.logger.assign({ userId: user.id })` — безопасно, работает с PinoLogger.
- `gql-logging.interceptor.ts:91-93`: `req.graphql = graphqlData` — простое присваивание свойства, не merge.

**Вердикт**: Кодовая база не содержит уязвимых паттернов prototype pollution.

### VAL-08.details — Загрузка файлов

**MIME-тип:**

```ts
// file-upload.service.ts:55
if (!this.ALLOWED_MIME_TYPES.has(part.mimetype)) {
  await part.toBuffer();
  return null; // silently skip
}
```

- **Проблема**: `part.mimetype` — это заголовок `Content-Type` из multipart-части, который клиент может подделать.
- MIME проверяется ТОЛЬКО по заголовку, НЕ по содержимому (magic bytes).
- Злоумышленник может отправить `.exe` с `Content-Type: image/png`, и файл будет принят.

**Размер файла:**

- **Не проверяется**: нет `part.file.bytesRead`, `maxFileSize` или `limits` в `@fastify/multipart`.
- Настройки `@fastify/multipart` по умолчанию не задают ограничений (регистрация в `setup-app.ts:18` без параметров):
  ```ts
  await app.register(multiPart); // Нет limits: { fileSize: ... }
  ```

**Имя файла:**

- ✅ `originalFilename` сохраняется в БД, но для пути на диске используется `randomUUID() + extension` — санитизация есть.
- ✅ Путь генерируется через `path.join` даты + UUID — безопасно.
- ✅ Path traversal защищён в `getSafeFileInfo()` (проверка `resolvedPath.startsWith(resolvedRoot)`).

**Количество файлов:**

- ❌ Нет лимита на количество файлов за один запрос.

---

## Audit Coverage

| Компонент | Файлы проверены | Статус |
|-----------|----------------|--------|
| Prisma schema | `prisma/schema.prisma` | Проверено — 2 модели (Profile, Upload), без Blob/File полей |
| File upload — Controller | `file-upload.controller.ts` | Проверено — нет DTO-валидации |
| File upload — Service | `file-upload.service.ts` | Проверено — MIME whitelist, path traversal защита, без size limit |
| File upload — Module | `file-upload.module.ts` | Проверено — wiring |
| Profile — Resolver | `profile.resolver.ts` | Проверено — использует `ProfileUpdateInput` (ZodDto) |
| Profile — Service | `profile.service.ts` | Проверено — spread в Prisma |
| Profile — DTO | `profile-update.input.ts` | Проверено — единственная Zod-схема в коде |
| Profile — ObjectType | `profile.object-type.ts` | Проверено — GraphQL object type |
| Profile — Enum | `profile-role.enum.ts` | Проверено — зарегистрирован в GraphQL |
| Auth — JWT Guard | `jwt-auth.guard.ts` | Проверено — identity из контекста, mock-mode note |
| Auth — JWT Strategy | `jwt.strategy.ts` | Проверено — validate по sub из токена |
| Auth — Optional Guard | `jwt-optional-auth.guard.ts` | Проверено — null fallback |
| Auth — Roles Guard | `roles.guard.ts` | Проверено — чтение из контекста |
| Auth — CurrentUser | `current-user.decorator.ts` | Проверено — чтение из request.user |
| Auth — Roles decorator | `roles.decorator.ts` | Проверено |
| Auth — Module | `auth.module.ts` | Проверено |
| GraphQL — Setup | `app.module.ts` (GraphQLModule) | Проверено — errorFormatter, autoSchemaFile |
| GraphQL — Error formatter | `error-formatter.ts` | Проверено — обработка ZodValidationException |
| Bootstrap — Setup app | `setup-app.ts` | Проверено — глобальный ZodValidationPipe, multipart, helmet, rateLimit |
| AllExceptions filter | `all-exceptions-filter.ts` | Проверено — обработка ZodValidationException |
| Prisma Service | `prisma.service.ts` | Проверено |
| Real IP decorator | `real-ip.decorator.ts` | Проверено — чтение ip из request |
| Health controller | `health.controller.ts` | Проверено — нет входных данных |
| App controller | `app.controller.ts` | Проверено — NotFoundException |
| Prisma Studio controller | `prisma-studio.controller.ts` | Проверено — `@Body() body: unknown` без валидации |
| Logger Serve controller | `logger-serve.controller.ts` | Проверено — `@Param('*')` без валидации, path traversal check своя |
| Logger Serve auth guard | `auth.guard.ts` | Проверено — Basic auth guard |
| Debug resolver | `debug.resolver.ts` | Проверено — echo/testTranslation без Zod, JSON.parse в try/catch |
| Test Queue resolver | `test-queue.resolver.ts` | Проверено — `@Args('message')` без Zod |
| GQL Logging interceptor | `gql-logging.interceptor.ts` | Проверено — JSON.parse в truncateResponse (internal data) |
| Pino config | `pino-config.ts` | Проверено — redact config, logging |
| Dotenv validator | `dotenv-validator.service.ts` | Проверено |
| Package.json | `package.json` | Проверено — nestjs-zod ^5.3.0, zod ^4.4.3 |

---

## Рекомендации

### Критические (Fix ASAP)

1. **VAL-08: Добавить проверку MIME по содержимому**
   - Использовать `file-type` или `sharp` для верификации magic bytes загружаемых файлов.
   - Не полагаться только на `part.mimetype` (client-supplied header).

2. **VAL-08: Ограничить размер файла**
   - Добавить `limits: { fileSize: 10 * 1024 * 1024 }` (10MB) при регистрации `@fastify/multipart` в `setup-app.ts`.

3. **VAL-08: Ограничить количество файлов**
   - Добавить счётчик в `uploadFile()` контроллера (max 10 файлов за запрос).

### Высокие (Fix Soon)

4. **VAL-01: ZodDto-валидация для REST endpoints**
   - `GET /uploads/*` (`@Param('*')`) — добавить Zod-схему для wildcard path (хотя бы проверка на path traversal).
   - `POST /upload` — рассмотреть `@fastify/multipart` schema validation или кастомный pipe.
   - `PrismaStudioController` — добавить body-валидацию.

5. **VAL-01: Zod-схемы для GraphQL scalar args**
   - `@Args('text')`, `@Args('message')`, `@Args('username')` — обернуть в ZodDto для `.max()`.

6. **VAL-02: Добавить `.max()` в `ProfileUpdateSchema`**
   - `avatarUrl: z.url().max(2048).optional()` (URL больше 2048 символов — редкость).

### Средние

7. **VAL-04: Защита mock-режима**
   - Проверять `NODE_ENV !== 'production'` перед активацией mock-аутентификации.
   - Не копировать `x-mock-sub` в production.

8. **VAL-08: Мягкая валидация originalFilename**
   - Хотя файл на диске хранится с UUID-именем, `originalFilename` в БД — без санитизации. Добавить Zod-схему на длину (max 255).

---

## End of Report

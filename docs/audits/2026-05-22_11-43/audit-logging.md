# Audit Report: Logging Best Practices — 2026-05-22 11:43

## Общая информация

| Параметр | Значение |
|----------|----------|
| Runtime | Node.js / NestJS 11 |
| Логгер | `nestjs-pino` (Pino) |
| Ротация | `pino-roll`, daily, 20MB, 10 файлов |
| Формат | JSON в файлы, pino-pretty в dev-режиме |
| Redaction | Есть (пароли, токены, секреты) |

## Результаты проверок

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| LOG-01 | Production-код не использует console.log/console.error напрямую | ✅ PASS | High | `console.*` найдены только в `main.ts:13,18,52` (pre-bootstrap), `git-commit-saver.ts` (build-time), `logger-ui.html.ts` (client-side JS). В production-сервисах console не используется. | — | — |
| LOG-02 | PII не логируется (email, телефон, имена, адреса, финансовые данные) | ✅ PASS | High | В логах сервисов только `profileId`, `count`, `filenames` (имена файлов), `userId`. Email, телефоны, адреса не обнаружены. | — | — |
| LOG-03 | Секреты и токены не попадают в логи | ✅ PASS | High | `pino-config.ts:156-176` настроен redact для `password`, `token`, `secret`, `authorization`, `apiKey`. GQL interceptor краснокит `password`, `token`, `secret`, `credentials`. `db-backup-tool/backup.ts:40-45` маскирует пароль. | — | — |
| LOG-04 | Запросы трассируются (Request ID или correlation ID сквозной) | ❌ FAIL 🟡 | High | Request ID есть в HTTP-логах (pino-http) и в `AllExceptionsFilter`, `GqlErrorFormatter`. Но сервисы (`ProfileService`, `FileUploadService`, `TestQueueProcessor`) логируют без requestId и userId — цепочку запроса восстановить нельзя. | **1. Пробрасывать requestId через DI или async local storage** \\ 2. Использовать `PinoLogger.assign()` в каждом сервисе \\ 3. Создать middleware, который автоматически добавляет traceId в логгер | Нет |
| LOG-05 | Формат логов структурирован (JSON) в production | ✅ PASS | High | `pino-config.ts:179-198` — настроены JSON-транспорты `pino-roll` в файлы `all/log` и `error/log`. `pino-pretty` только в dev-режиме. | — | — |
| LOG-06 | Критические операции логируются (auth, create, update, delete) | ❌ FAIL 🟠 | High | `AuthService` — **нет логов** при создании/поиске профиля (`findOrCreateProfile`, `findProfileBySub`). `JwtStrategy` — **нет логов** при успешной/неудачной валидации JWT. Profile update — логируется OK. File upload — логируется OK. | **1. Добавить `logger.log()` в `AuthService.findOrCreateProfile`** \\ 2. Добавить `logger.warn()` в `JwtStrategy.validate` при ошибке \\ 3. Добавить audit-лог для всех критических операций с БД | Да (AuthService: логи при findOrCreateProfile и findProfileBySub) |
| LOG-07 | User input санитизируется перед логированием (защита от log injection) | ❌ FAIL 🟡 | High | `debug.resolver.ts:69` — `this.logger.log({ resolver: 'echo', text })` — user input идёт напрямую в лог. `file-upload.service.ts:96` — `originalFilename` от пользователя идёт в лог без санитизации. Возможна log injection с `\n`, `\r`, ANSI-escape. | **1. Санитизировать user input через функцию типа `sanitizeLogInput()`** \\ 2. Добавить обёртку над логгером \\ 3. Экранировать управляющие символы | Нет |
| LOG-08 | Критические события безопасности логируются | ❌ FAIL 🟠 | High | `AuthService` — нет логов при успешном/неудачном входе. `JwtStrategy` — нет логов при невалидном токене. `PrismaStudioService:39,49,59` — логирует `Unauthorized`/`Forbidden` на **ERROR** уровне (должен быть `warn`). `PrismaStudioService:64` — `Authorized` на info (OK). | **1. Добавить аудит логин/логаут/ошибки аутентификации в auth модуль** \\ 2. Исправить уровни логов в PrismaStudioService (401/403 → `warn`) \\ 3. Логировать JWT validation failures | Да (AuthService логи + PrismaStudio log levels error→warn) |

## Дополнительные находки

### LOG-09: Нестандартное использование уровней логов
**Файл:** `src/dev-tools/prisma-studio/prisma-studio.service.ts:39,49,59`

Ошибки клиента (401 Unauthorized, 403 Forbidden) логируются как `logger.error()`. По смыслу это `warn`, а не `error`.

```typescript
// Было:
this.logger.error('Unauthorized');       // 401 — клиентская ошибка
this.logger.error('Authorization header missing');
this.logger.error('Forbidden');          // 403 — клиентская ошибка
// Должно быть:
this.logger.warn('Unauthorized');
```

### LOG-10: PinoLogger vs @nestjs/common Logger
**Файлы:** 14 файлов используют `new Logger()` из `@nestjs/common`

Из 16 классов с логгером только 2 используют `PinoLogger` из `nestjs-pino`:
- `JwtAuthGuard` — использует `PinoLogger`
- `GqlLoggingInterceptor` — использует `PinoLogger`

Остальные 14 используют `Logger` из `@nestjs/common`. Хотя `app.useLogger()` в `setup-app.ts:20` перенаправляет логи через pino, прямой `PinoLogger` даёт:
- `setContext()` — переключение контекста
- `assign()` — добавление полей к текущему запросу
- `child()` — создание дочернего логгера
- Структурированные аргументы без реформата от NestJS

### LOG-11: Стек ошибок не логируется
**Файл:** `src/common/prisma/prisma.service.ts:52`

```typescript
this.logger.warn({
  msg: `DB connection attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms`,
  err: error instanceof Error ? error.message : error, // ❌ Только message, нет stack
});
```

В `AllExceptionsFilter:106-108` — ошибки 500+ логируются с `stack` — это правильно. А в PrismaService — только `message`.

### LOG-12: stdout/stderr в PrismaStudioService
**Файл:** `src/dev-tools/prisma-studio/prisma-studio.service.ts:20-21`

```typescript
this.logger.log('Command execution stdout:', stdout);  // stdout на info
this.logger.error('Command execution stderr:', stderr); // stderr на error
```

`stderr` всегда логируется как `error`, даже если команда завершилась успешно (некоторые утилиты пишут в stderr прогресс). Лучше логировать stderr как `warn` и только при ненулевом содержимом.

### LOG-13: sConsole в prestart:prod скрипте
**Файл:** `package.json:15`

```javascript
console.error('Migrations failed after '+max+' attempts');
console.warn('Migration attempt '+i+'/'+max+' failed, retry in '+d+'ms');
```

Это shell-скрипт в package.json, а не код приложения. Использование `console` здесь допустимо, но для consistency можно заменить на простой `process.stderr.write()`.

## Audit Coverage

| Область | Статус | Файлов |
|---------|--------|--------|
| src/modules/ | ✅ Проверено | 2 (profile, file-upload) |
| src/common/ | ✅ Проверено | 8 (logger, prisma, auth, graphql, filter) |
| src/infrastructure/ | ✅ Проверено | 3 (health, test-queue) |
| src/dev-tools/ | ✅ Проверено | 4 (debug, studio, launcher, logger-serve) |
| src/db-backup-tool/ | ✅ Проверено | 3 (backup, restore, logger) |
| src/main.ts | ✅ Проверено | 1 |
| src/bootstrap/ | ✅ Проверено | 1 (setup-app) |
| **Всего** | | **22 файла с логированием** |

## Итог

| Статус | Количество |
|--------|------------|
| ✅ PASS | 4 (LOG-01, LOG-02, LOG-03, LOG-05) |
| ❌ FAIL | 4 (LOG-04 🟡, LOG-06 🟠, LOG-07 🟡, LOG-08 🟠) |
| ⏸ ACCEPTED | 0 |

**Нужно исправить:**
1. 🟠 **LOG-06** — Добавить аудит критических операций (auth, create профиля) 
2. 🟠 **LOG-08** — Добавить аудит безопасности (login/logout/failures) + исправить уровни логов
3. 🟡 **LOG-04** — Пробросить requestId в сервисные логи
4. 🟡 **LOG-07** — Санитизировать user input в логах

## Рекомендации

### Критические (🔴) — нет
### Высокие (🟠)
1. **Добавить аудит операций auth** — `AuthService`, `JwtStrategy` не логируют вход/создание профиля/ошибки
2. **Добавить audit trail безопасности** — логировать успешную/неудачную аутентификацию
3. **Исправить уровни логов в PrismaStudioService** — 401/403 → `warn`

### Средние (🟡)
1. **Пробросить requestId в сервисы** — через `AsyncLocalStorage` или DI
2. **Санитизировать user input** — в debug.resolver и file-upload.service
3. **Рассмотреть переход на PinoLogger** во всех сервисах вместо Logger из @nestjs/common (14 файлов)

### Низкие (🟢)
1. Добавить `stack` в лог ошибок `PrismaService.onModuleInit`
2. Логировать stderr как `warn` в `PrismaStudioService`

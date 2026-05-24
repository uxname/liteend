# Audit Report: Boundary Data Validation — 2026-05-22 11:43

## Baseline
`accepted: []` — все проверки активны.

## Результаты проверок

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| **VAL-01** | Все входящие данные (body, params, query) проходят schema-валидацию | ❌ FAIL 🟠 | High | `src/infrastructure/test-queue/test-queue.resolver.ts:14` — `message` принимается как `String` без Zod-схемы; `src/dev-tools/debug/debug.resolver.ts:54,68,77` — `username`, `text` без Zod-схемы | **1. Добавить Zod-схемы с createZodDto для всех GraphQL аргументов**; 2. Установить глобальный limit на размер строк через Zod; 3. Оставить как есть — аргументы защищены GraphQL type system (String) и RolesGuard (ADMIN) | Нет |
| **VAL-02** | Строки имеют maxLength, числа — диапазон, enum-значения — whitelist | ❌ FAIL 🟡 | High | `src/infrastructure/test-queue/test-queue.resolver.ts:14` — `message: string` без maxLength; `src/dev-tools/debug/debug.resolver.ts:54,68,77` — `username`, `text` без maxLength; `src/dev-tools/logger-serve/logger-serve.controller.ts:97` — `start` offset без верхней границы | **1. Добавить maxLength (например 500) в Zod-схемы для строковых аргументов**; 2. Ограничить `start` query-параметр разумным верхним пределом; 3. Оставить с условием, что эндпоинты под RolesGuard(ADMIN) | Нет |
| **VAL-03** | JSON.parse обёрнут в try/catch с последующей валидацией структуры | ❌ FAIL 🟡 | High | `src/common/auth/auth.service.ts:16,36` — `JSON.parse(cached)` из Redis без try/catch | **1. Обернуть JSON.parse в try/catch с логированием**; 2. Добавить Zod-схему для верификации структуры распарсенного объекта; 3. Использовать safe JSON.parse из lodash или утилиты | Да (try/catch + del + refetch) |
| **VAL-04** | Identity данные берутся из аутентифицированного контекста (не из user input) | ❌ FAIL 🟠 | High | `src/common/auth/jwt-auth.guard.ts:37` — mock-режим принимает `x-mock-sub` из заголовка и ищет профиль по этому sub; `src/modules/profile/profile.service.ts:21` — `...input` spread без whitelist (но Input содержит только avatarUrl — риск низкий) | **1. Добавить guard, блокирующий mock-режим в production**; 2. Логировать каждый случай использования mock-заголовка; 3. Вынести mock-логику в отдельный dev-модуль, подключаемый только для development | Да (добавлена проверка NODE_ENV !== 'production') |
| **VAL-05** | Вложенные структуры и массивы ограничены (глубина, minItems/maxItems) | ✅ PASS | Medium | `src/bootstrap/setup-app.ts:44` — `queryDepth: 8` ограничивает глубину GraphQL запросов; `@fastify/multipart` — `files: 10` лимит файлов | — | — |
| **VAL-06** | Валидатор не выполняет неявный coercion | ✅ PASS | Medium | GraphQL type system (Mercurius) проверяет типы на транспортном уровне; `nestjs-zod` не выполняет неявный coercion на верхнем уровне; `Number.parseInt` в logger-serve с `Number.isNaN` | — | — |
| **VAL-07** | Prototype pollution: merge/assign с user input фильтрует __proto__, constructor, prototype | ✅ PASS | High | Нет `Object.assign` или `_.merge` с user input; Prisma принимает только whitelist-поля из Zod-схем | — | — |
| **VAL-08** | Загрузка файлов: MIME тип проверяется по содержимому, имя файла санитизировано, размер ограничен | ❌ FAIL 🟡 | Medium | `src/modules/file-upload/file-upload.service.ts:58` — MIME тип проверяется из `part.mimetype` (client-reported), а не по содержимому файла; разрешены SVG (`image/svg+xml`) — потенциальный XSS-вектор | **1. Проверять MIME тип по magic bytes (file-type или аналог)**; 2. Исключить SVG из разрешённых MIME типов или добавить санитизацию; 3. Усилить проверку размера на уровне `processFile` (дублирующий check) | Да (SVG исключён из разрешённых) |

## Детальное описание найденных проблем

### VAL-01 / VAL-02: Отсутствие Zod-валидации для GraphQL аргументов

**Файлы**: 
- `src/infrastructure/test-queue/test-queue.resolver.ts:14`
- `src/dev-tools/debug/debug.resolver.ts:54,68,77`

**Проблема**: Аргументы GraphQL-запросов принимаются напрямую через `@Args()` без прохождения через `createZodDto`:

```typescript
// test-queue.resolver.ts:14
async addTestJob(@Args('message', { type: () => String }) message: string)

// debug.resolver.ts:54
testTranslation(@Args('username', { type: () => String }) username: string)

// debug.resolver.ts:68
echo(@Args('text', { type: () => String }) text: string)

// debug.resolver.ts:77
echoMutation(@Args('text', { type: () => String }) text: string)
```

Хотя GraphQL проверяет тип (String), отсутствуют:
- Ограничение длины строки (maxLength) — потенциальный DoS через гигантские строки
- Форматная валидация (email, URL и т.д.)
- Санитизация перед передачей в сервисы/логи

**Риск**: 🟡 DoS через неограниченные строки, неконтролируемые логи

**Защита**: `test-queue` под `JwtAuthGuard`, `debug` под `JwtOptionalAuthGuard` + `RolesGuard(ADMIN)`

---

### VAL-03: JSON.parse без обработки ошибок

**Файлы**: `src/common/auth/auth.service.ts:16,36`

```typescript
// auth.service.ts:15-17
const cached = await this.redis.getClient().get(`profile:sub:${oidcSub}`);
if (cached) {
  return JSON.parse(cached);  // ❌ может выбросить SyntaxError
}
```

**Проблема**: Если в Redis попадёт некорректный JSON (например, из-за битых данных или ручного изменения), `JSON.parse` выбросит `SyntaxError` и упадёт с 500 ошибкой.

**Риск**: 🟡 Неожиданный 500 Internal Server Error при битом кэше — отказ в обслуживании для конкретного пользователя

---

### VAL-04: Mock-режим обходит JWT-аутентификацию

**Файл**: `src/common/auth/jwt-auth.guard.ts:34-50`

```typescript
if (isMockEnabled) {
  const mockSub = request.headers?.['x-mock-sub'];
  if (mockSub) {
    const user = await this.authService.findProfileBySub(mockSub);
    if (user) {
      this.syncUser(request, user);
      return true;  // ✅ Полный доступ с произвольным sub
    }
  }
  const defaultUser = await this.authService.findOrCreateDefaultMockUser();
  this.syncUser(request, defaultUser);
  return true;
}
```

**Проблема**: Заголовок `x-mock-sub` позволяет войти под любым существующим профилем без JWT. Зависит только от env-флага `OIDC_MOCK_ENABLED=true`. Если флаг случайно попадёт в production — полный обход аутентификации.

**Риск**: 🟠 Полный обход аутентификации при включённом mock-режиме в production

---

### VAL-08: MIME тип файла не верифицирован по содержимому

**Файл**: `src/modules/file-upload/file-upload.service.ts:58`

```typescript
if (!this.ALLOWED_MIME_TYPES.has(part.mimetype)) {
  await part.toBuffer();
  return null;
}
```

**Проблема**: `part.mimetype` устанавливается клиентом (браузером или curl). Злоумышленник может отправить `.php` или `.html` с mimetype `image/png`, и файл будет сохранён с UUID-именем + оригинальным расширением.

**Дополнительно**: `image/svg+xml` разрешён — SVG может содержать скрипты (XSS-атака при отображении).

**Риск**: 🟡 Загрузка вредоносных файлов с подменённым MIME типом; потенциальный XSS через SVG

---

## Audit Coverage

**Проверено**: `src/common/auth/**`, `src/modules/profile/**`, `src/modules/file-upload/**`, `src/common/prisma/**`, `src/infrastructure/health/**`, `src/infrastructure/test-queue/**`, `src/common/all-exceptions-filter.ts`, `src/bootstrap/setup-app.ts`, `src/common/graphql/error-formatter.ts`, `src/common/real-ip/**`, `src/common/logger/gql-logging.interceptor.ts`, `src/dev-tools/debug/**`, `src/dev-tools/logger-serve/**`, `src/dev-tools/prisma-studio/**`, `src/app.module.ts`, `prisma/schema.prisma`

**Пропущено**: `test/**`, `src/@generated/**`, `src/db-backup-tool/**`, `assets/**`, `data/**`, `coverage/**`, `dist/**`

**Файлов проверено**: 38 | **Пропущено**: N/A (пропущены только сгенерированные и конфигурационные)

# Audit Report: Bugs & Logic Errors — 2026-05-22 11:43

## Результаты

| Check ID | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|--------|-------------|----------------|---------|------------|
| BUG-01 | ✅ PASS | High | `src/` — все `parseInt` с radix, все сравнения через `===` | — | — |
| BUG-02 | ❌ FAIL 🟡 | High | `profile.resolver.ts:51` — `pubSub.publish()` без await | **1. Добавить `await` перед `pubSub.publish()`** \\ 2. Добавить `.catch()` для graceful degradation \\ 3. Обернуть в try/catch с логированием | Нет |
| BUG-02 | ❌ FAIL 🟡 | High | `gql-logging.interceptor.ts:49-51` — `JSON.parse(truncated)` может упасть | **1. Убрать JSON-обрезку, рекурсия внизу уже обрабатывает все случаи** \\ 2. Обрезать на границе последнего ключа, а не по байтам \\ 3. Заменить на try/catch с fallback на строку | Нет |
| BUG-03 | ✅ PASS | High | `src/` — optional chaining (`?.`) используется везде, null-проверки есть | — | — |
| BUG-04 | ✅ PASS | High | `src/` — sort/splice не мутируют аргументы в критических путях | — | — |
| BUG-05 | ✅ PASS | Medium | `src/` — нет switch на enum-ах, union-types обрабатываются | — | — |
| BUG-06 | ✅ PASS | High | `src/` — нет деления, NaN проверки через parseInt с || '0' | — | — |
| BUG-07 | ❌ FAIL 🟢 | High | `test-queue.resolver.ts:17-18` — `getJob` с dedup-ID никогда не находит job | **1. Убрать `getJob` — BullMQ dedup работает сам** \\ 2. Передать `jobId` в `this.testQueue.add()` \\ 3. Оставить как dead code с TODO-комментарием | Нет |
| BUG-07 | ❌ FAIL 🟢 | Medium | `file-upload.controller.ts:94` — TOCTOU: file access до createReadStream | **1. Добавить обработку ошибок на стрим: `.on('error', handler)`** \\ 2. Обернуть send в try/catch \\ 3. Проверять файл атомарно через open/read | Нет |
| BUG-08 | ✅ PASS | High | `src/` — нет float сравнений в критических путях | — | — |
| BUG-09 | ✅ PASS | High | `src/` — все даты через `toISOString()`, `getUTC*()` — UTC корректно | — | — |
| BUG-10 | ✅ PASS | High | `src/` — нет `new RegExp(userInput)` в критических путях | — | — |

## Детальные находки

### ❌ FAIL BUG-02 — Missing await: pubSub.publish() не ожидается

**Файл:** `src/modules/profile/profile.resolver.ts:51`

**Проблема:**
```typescript
pubSub.publish({
  topic: EVENTS.PROFILE_UPDATED,
  payload: {
    profileUpdated: updatedProfile,
  },
});
```
`pubSub.publish()` возвращает Promise. Он не ждётся (`await`) и нет `.catch()`. Если publish упадёт (Redis недоступен, сеть), ошибка проглочена. Клиент получит `success`, но подписчики не увидят обновления.

**Риск:** Потеря событий при сбое Redis — подписчики не узнают об обновлении профиля. Диагностика невозможна.

**Решение:** Поставить `await`.

---

### ❌ FAIL BUG-02 — JSON.parse(truncated) может упасть

**Файл:** `src/common/logger/gql-logging.interceptor.ts:49-51`

**Проблема:**
```typescript
const jsonStr = JSON.stringify(data);
if (jsonStr.length > maxBytes) {
  const truncated = jsonStr.slice(0, maxBytes);
  return JSON.parse(truncated) as object;  // Может выбросить SyntaxError
}
```
JSON-строка обрезается по байтам, без учёта границ токенов. `JSON.parse` упадёт, если обрезка попала в середину строки, числа или структуры. Ошибка из interceptor-а убьёт ответ GraphQL (500 вместо данных).

**Риск:** Любой GraphQL-запрос с ответом >4096 байт может упасть с 500.

**Решение:** Убрать JSON-обрезку — рекурсивный проход (цикл `for` ниже) уже обрабатывает все случаи корректно. JSON-обрезка — ненужная оптимизация, которая ломает ответы.

---

### ❌ FAIL BUG-07 — getJob с dedup-ID никогда не находит job (dead code)

**Файл:** `src/infrastructure/test-queue/test-queue.resolver.ts:17-18`

**Проблема:**
```typescript
const jobId = `dedup:test:${message}`;
const existing = await this.testQueue.getJob(jobId);
if (existing && (await existing.isActive())) {
  return true;
}
```
`jobId` (`dedup:test:...`) — это ID дедупликации, а не ID задачи. BullMQ при `add` с `deduplication.id` создаёт задачу с числовым ID. `getJob(dedupId)` никогда ничего не найдёт. Проверка всегда false — guard мёртвый код. Дедупликация работает только через BullMQ.

**Риск:** Нет — BullMQ dedup работает. Но код вводит в заблуждение и недостижим.

**Решение:** Убрать `getJob` целиком.

---

### ❌ FAIL BUG-07 — TOCTOU: проверка файла и чтение не атомарны

**Файл:** `src/modules/file-upload/file-upload.controller.ts:94`, `src/modules/file-upload/file-upload.service.ts:46-48`

**Проблема:**
```typescript
// service.ts
await fsAsync.access(resolvedPath);  // проверка
// ... позже ...
// controller.ts
response.send(fs.createReadStream(fullPath));  // чтение
```
Файл может быть удалён между `access` и `createReadStream`. Стрим упадёт с ошибкой, она не обработана.

**Риск:** Редкий случай — если файл удалён между проверкой и чтением, клиент получит оборванный ответ/ошибку без обработки.

**Решение:** Добавить `.on('error')` на стрим: `createReadStream(fullPath).on('error', () => response.status(404).send('Not found'))`.

---

## Audit Coverage

**Проверено:**
- `src/common/auth/**` (7 файлов)
- `src/modules/profile/**` (5 файлов)
- `src/modules/file-upload/**` (3 файла)
- `src/common/prisma/**` (2 файла)
- `src/infrastructure/health/**` (3 файла)
- `src/infrastructure/test-queue/**` (3 файла)
- `src/common/all-exceptions-filter.ts`
- `src/bootstrap/setup-app.ts`
- `src/common/graphql/error-formatter.ts`
- `src/common/redis/redis.service.ts`
- `src/common/real-ip/real-ip.decorator.ts`
- `src/common/logger/gql-logging.interceptor.ts`
- `src/common/logger/pino-config.ts`
- `src/common/git-commit-saver.ts`

**Пропущено:** `src/db-backup-tool/**`, `src/dev-tools/**`, `test/**`, `migrations/**`

**Файлов проверено:** 28 | **Пропущено:** не критичны для аудита (dev-tools, db-backup)

---

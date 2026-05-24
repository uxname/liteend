# Аудит конкурентности и управления состоянием

Дата: 2026-05-22
Проверено файлов: 6 critical + 6 вспомогательных

---

## Сводка

| Статус | Кол-во |
|--------|--------|
| ❌ FAIL | 3 |
| ⏸ ACCEPTED | 0 |
| ✅ PASS | 7 |

---

## CON-01 ❌ 🟠 Cache stampede в `AuthService.findOrCreateProfile`

**Файл:** `src/common/auth/auth.service.ts:14-18`

**Описание:** При кеш-миссе несколько concurrent запросов с одинаковым `oidcSub` могут одновременно пойти в БД. `upsert` атомарен — данные не повреждятся, но будет лишняя нагрузка на БД. Второй запрос перезапишет кеш — это нормально, но первый запрос сделал лишнюю работу.

**Пример сценария:**
1. Запрос A: check Redis → miss → Prisma upsert → set cache
2. Запрос B: check Redis → miss (A ещё не записал) → Prisma upsert → set cache

**Fix:** Использовать `SET NX` как distributed lock при кеш-миссе. Или Queue worker для обновления кеша.

---

## CON-02 ❌ 🟠 → ✅ FIXED Race condition в `ProfileService.updateProfile` (cache invalidation)

**Файл:** `src/modules/profile/profile.service.ts:24-27`

**Описание:** Между `prisma.profile.update` и `redis.del()` есть окно, в котором другой запрос может прочитать старый кеш. Если два concurrent update:

1. Запрос A: UPDATE DB → (окно) → DEL cache
2. Запрос B: UPDATE DB → DEL cache  
3. Запрос C (читать): читает СТАРЫЙ кеш (пока A не удалил)

**Fix:** Удалять кеш **до** обновления БД (lazy caching — следующий запрос перезапишет). Или использовать `SET` вместо `DEL` с новыми данными.

**Исправлено:** Да (write-through cache: SET вместо DEL)

---

## CON-03 ❌ 🟡 → ✅ FIXED TOCTOU в `FileUploadService.getSafeFileInfo`

**Файл:** `src/modules/file-upload/file-upload.service.ts:45-48`, `src/modules/file-upload/file-upload.controller.ts:94`

**Описание:** `fsAsync.access()` проверяет что файл существует, но между check и read файл может быть удалён другим процессом. Это не баг данных, но лишний race condition.

**Fix:** Убрать `access()`, читать файл напрямую и ловить `ENOENT` → `NotFoundException`.

**Исправлено:** Да (on('error') хендлер на стрим, 404 при ошибке)

---

## CON-04 ✅ 🟡 Отсутствие распределённых блокировок (Redis locks)

**Файл:** Весь проект

**Описание:** В коде нет ни одного `SET NX`, `Redlock` или любого другого distributed lock. При multi-instance деплое это может привести к:
- Оба инстанса обновляют один и тот же профиль
- Оба инстанса пишут файлы в одну директорию (но UUID спасает)
- Cache stampede не блокируется между инстансами

**Severity:** 🟡 — сейчас код не имеет критических shared ресурсов между инстансами (кроме БД с её own locking). Но при расширении это станет проблемой.

**Fix:** Добавить `SET NX` обёртку для кеш-миссов в AuthService. Для профиля это не критично пока.

---

## CON-05 ✅ 🟡 Нет Prisma `$transaction` в multi-step операциях

**Файл:** `src/modules/file-upload/file-upload.service.ts:69-86`

**Описание:** `processFile` сначала пишет файл на диск, потом `saveMetadata` в БД. Если `saveMetadata` упадёт — файл останется orphan на диске. Два шага не атомарны.

**Fix:**
- Вариант А: Удалять файл при ошибке `saveMetadata`
- Вариант Б: Сначала записывать в БД, потом на диск (но это другая проблема)
- Вариант В: Cron cleanup для orphan-файлов

---

## CON-06 ✅ → ❌ FIXED Redis `maxRetriesPerRequest: null`

**Файл:** `src/common/redis/redis.service.ts:22`

**Описание:** `maxRetriesPerRequest: null` — бесконечные ретраи при падении Redis. При этом все requests будут ждать восстановления. Нет circuit breaker.

**Fix:** Установить конечное значение (например, `20`). И добавить таймаут на reconnect.

**Исправлено:** Да (maxRetriesPerRequest: 20)

---

## CON-07 ✅ 🟡 → ❌ FIXED BullMQ: неявная concurrency=1

**Файл:** `src/infrastructure/test-queue/test-queue.processor.ts:5`

**Описание:** `@Processor('test')` без `concurrency`. BullMQ по умолчанию ставит 1, что безопасно. Но не очевидно.

**Fix:** Явно указать `@Processor('test', { concurrency: 5 })` — документирует намерение и улучшает пропускную способность.

**Исправлено:** Да (concurrency: 5)

---

## CON-08 ✅ 🟡 Dedup race в TestQueueResolver

**Файл:** `src/infrastructure/test-queue/test-queue.resolver.ts:16-20`

**Описание:** Между `getJob()` и `add()` может прийти второй concurrent запрос. Но BullMQ deduplication ID (`deduplication.id`) на уровне Redis решает эту проблему — дубликат не будет добавлен. Check на `getJob` избыточен, но не вреден.

**Status:** ✅ PASS — dedup ID гарантирует уникальность.

---

## CON-09 ✅ 🟢 Backup: `isBackingUp` guard

**Файл:** `src/db-backup-tool/backup.ts:56-63`

**Описание:** `setInterval` может наложиться, если бэкап делается дольше интервала. `isBackingUp` guard предотвращает параллельные бэкапы. Простой boolean в single-process — корректно.

**Status:** ✅ PASS.

---

## CON-10 ✅ 🟢 Нет deadlock потенциала

**Файл:** Весь проект

**Описание:** Нет Prisma `$transaction` (interactive), нет nested SELECT FOR UPDATE, нет взаимных блокировок. Все операции — single-row writes или reads. Deadlock невозможен в текущей архитектуре.

**Status:** ✅ PASS.

---

## CON-11 ✅ 🟢 Нет thundering herd в BullMQ

**Файл:** `src/app.module.ts:95-103`

**Описание:** `attempts: 3`, `backoff: { type: 'exponential', delay: 1000 }` — корректные настройки. Единственная очередь `test` не критична. Retry war не возникнет.

**Status:** ✅ PASS.

---

## Итого

| Категория | Найдено | Статус |
|-----------|---------|--------|
| Гонки данных (race conditions) | 3 | ❌ CON-01, CON-02, CON-03 |
| Блокировки (locks) | 1 | ✅ CON-04 (не критично) |
| Транзакции | 1 | ✅ CON-05 (cleanup нужен) |
| Redis/BullMQ конфиг | 2 | ✅ CON-06, CON-07 |
| TOCTOU | 1 | ❌ CON-03 |
| Deadlock | 0 | ✅ PASS |
| Thundering herd | 0 | ✅ PASS |

**Необходимо исправить перед production:**
- CON-01: Lock при кеш-миссе или SET NX
- CON-02: Удалять кеш до DB update
- CON-03: Убрать access() → ловить ENOENT
- CON-05: Удалять orphan-файлы при ошибке saveMetadata

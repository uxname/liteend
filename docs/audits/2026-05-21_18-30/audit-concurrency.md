# Audit Report: State & Concurrency — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| CON-01 | async/await не используется в неасинхронных итераторах (forEach, map) | PASS | Высокая | Найдено 1 in-file совпадение `proxyResponse.headers.forEach(...)` в `prisma-studio.service.ts:86` — синхронный forEach, не содержит `await`. `files.map(...)` в `file-upload.service.ts:83` — синхронный map. `files.map(async ...)` в `backup.ts:132` используется корректно под `Promise.all`. Единственный `for await` — в `file-upload.controller.ts:57` — правильное использование с async-итератором. | Отсутствует | Нет |
| CON-02 | Read-modify-write операции выполняются в транзакциях | PASS | Средняя | Вызовов `$transaction` не найдено **вообще** (0 результатов grep). Однако read-modify-write паттерны отсутствуют в production-коде: `prisma.profile.update` (profile.service.ts:11) — атомарный single-write; `prisma.profile.upsert` (jwt.strategy.ts:50) — атомарный; `prisma.upload.createMany` (file-upload.service.ts:82) — атомарный. Риск: при добавлении логики read-then-write транзакции не будут использованы автоматически. | Добавлять `$transaction` при появлении read-modify-write паттернов | Нет |
| CON-03 | Нет shared mutable state на уровне модуля | PASS (с оговоркой) | Высокая | **Production code:** Все module-level `const` — иммутабельны (константы, конфиги, логгеры). `DevLauncherController.cachedHtml` — instance-level (не module-level). **Non-production (`backup.ts`):** `let isBackingUp = false` (line 56) — module-level mutable state, корректно используется как reentrancy guard внутри одного процесса. Это standalone CLI-скрипт, не часть NestJS DI. | Вынести `isBackingUp` в замыкание или удалить при рефакторинге backup-скрипта | Нет |
| CON-04 | Module-level кэш имеет механизм инвалидации | FAIL | Высокая | `DevLauncherController` (dev-launcher.controller.ts:14): `private cachedHtml?: string` — instance-level singleton-кэш, заполняется при первом запросе (lazy init) и **никогда не инвалидируется**. При изменении `tools.ts` HTML не обновится до перезапуска приложения. `Cache-Control: no-cache, private` установлен, но это HTTP-заголовок для клиента, а не механизм инвалидации серверного кэша. Кроме того: `passportJwtSecret({ cache: true })` в jwt.strategy.ts — кэш JWKS с встроенным TTL (безопасно). GraphQL `cache: false` в app.module.ts:45 — отключён. | Добавить TTL-инвалидацию или перестраивать HTML при каждом запросе для DevLauncherController | ✅ Да |
| CON-05 | Обработчики событий и webhook-handlers идемпотентны | FAIL (низкий риск) | Средняя | `TestQueueProcessor` (test-queue.processor.ts) не идемпотентен: (1) нет deduplication по job.id; (2) BullMQ по-умолчанию использует at-least-once delivery — один job может быть обработан несколько раз; (3) при повторном выполнении с теми же данными side-effect (логирование) будет повторён; (4) `addTestJob` (resolver.ts:10-18) не проверяет дубликаты. **Важно:** это test-queue для разработки, не production-очередь. Webhook-handlers отсутствуют. | Для production-очередей добавить идемпотентность через dedup key или проверку состояния в БД | Нет |
| CON-06 | Background async операции имеют механизм отмены | FAIL | Средняя | 1. `TestQueueProcessor.process()` (line 14): `await new Promise((resolve) => setTimeout(resolve, 1000))` — нет `AbortController`, нет обработки сигнала отмены от BullMQ. 2. `backup.ts`: `setInterval(createBackup, ...)` (line 169) — нет `clearInterval` при shutdown; `childProcess.exec` (line 104) — нет передачи `AbortSignal`. 3. Во всей кодовой базе **0 упоминаний** `AbortController`, `abort`, `signal`, `cancel`. | Добавить `AbortController`/`AbortSignal` для долгих операций; для BullMQ-обработчиков добавить проверку `job.isCancelled()`; для `setInterval` — `clearInterval` в хуке onModuleDestroy | Нет |

---

## Audit Coverage

### Сканированные файлы

| Файл | Путь | CON-01 | CON-02 | CON-03 | CON-04 | CON-05 | CON-06 |
|------|------|--------|--------|--------|--------|--------|--------|
| Prisma schema | `prisma/schema.prisma` | — | — | — | — | — | — |
| PrismaService | `src/common/prisma/prisma.service.ts` | PASS | PASS | PASS | PASS | — | — |
| RedisService | `src/common/redis/redis.service.ts` | PASS | — | PASS | — | — | — |
| FileUploadService | `src/modules/file-upload/file-upload.service.ts` | PASS | PASS | PASS | — | — | — |
| FileUploadController | `src/modules/file-upload/file-upload.controller.ts` | PASS | — | PASS | — | — | — |
| ProfileService | `src/modules/profile/profile.service.ts` | PASS | PASS | PASS | — | — | — |
| ProfileResolver | `src/modules/profile/profile.resolver.ts` | PASS | — | PASS | — | — | — |
| TestQueueProcessor | `src/infrastructure/test-queue/test-queue.processor.ts` | PASS | — | — | — | FAIL | FAIL |
| TestQueueResolver | `src/infrastructure/test-queue/test-queue.resolver.ts` | PASS | — | — | — | FAIL | FAIL |
| TestQueueModule | `src/infrastructure/test-queue/test-queue.module.ts` | — | — | — | — | — | — |
| SetupApp | `src/bootstrap/setup-app.ts` | PASS | — | — | — | — | — |
| Main | `src/main.ts` | PASS | — | — | — | — | — |
| AllExceptionsFilter | `src/common/all-exceptions-filter.ts` | PASS | — | PASS | — | — | — |
| GqlErrorFormatter | `src/common/graphql/error-formatter.ts` | PASS | — | PASS | — | — | — |
| GqlLoggingInterceptor | `src/common/logger/gql-logging.interceptor.ts` | PASS | — | PASS | — | — | — |
| JwtStrategy | `src/common/auth/jwt.strategy.ts` | PASS | PASS | PASS | PASS | — | — |
| JwtAuthGuard | `src/common/auth/jwt-auth.guard.ts` | PASS | PASS | PASS | — | — | — |
| RolesGuard | `src/common/auth/roles.guard.ts` | PASS | — | PASS | — | — | — |
| DevLauncherController | `src/dev-tools/dev-launcher/dev-launcher.controller.ts` | PASS | — | PASS | FAIL | — | — |
| PrismaStudioService | `src/dev-tools/prisma-studio/prisma-studio.service.ts` | PASS | — | PASS | — | — | — |
| BullBoardModule | `src/dev-tools/bull-board/bull-board.module.ts` | PASS | — | PASS | — | — | — |
| HealthController | `src/infrastructure/health/health.controller.ts` | PASS | — | PASS | — | — | — |
| RedisHealthIndicator | `src/infrastructure/health/indicators/redis.health.ts` | PASS | — | PASS | — | — | — |
| AppModule | `src/app.module.ts` | PASS | — | PASS | PASS | — | — |
| Backup CLI script | `src/db-backup-tool/backup.ts` | PASS | PASS | PASS (оговорка) | — | — | FAIL |

### Поисковые запросы

| Паттерн | Результат |
|---------|-----------|
| `\.forEach\s*\(` | 1 match (synchronous, safe) |
| `for.*await` / `for await` | 1 match (`file-upload.controller.ts:57`, correct usage) |
| `\$transaction` / `transaction` | **0 matches** — транзакции Prisma не используются |
| `AbortController` / `abort` / `signal` / `cancel` | **0 matches** — механизмы отмены отсутствуют |
| `.lock\(` / `redlock` / `Redlock` / `mutex` / `semaphore` | **0 matches** — распределённые блокировки не используются |
| `@OnEvent` / `@Process(?!or)` / `EventHandler` | (только `@Processor`) — EventEmitter не используется |
| `idempot` / `dedup` / `job.*id` | 7 matches (только тестовые, не связанные с идемпотентностью) |
| `setInterval` / `setTimeout` | 4 matches (включая тестовые моки и backup.ts) |
| `existsSync` / `mkdirSync` | 13 matches (включая тесты; TOCTOU race в file-upload.service.ts) |

### Дополнительные находки (вне чеклиста)

1. **TOCTOU race condition** в `file-upload.service.ts:105-106`:
   ```ts
   if (!fs.existsSync(fullDir)) {   // time-of-check
     fs.mkdirSync(fullDir, ...);    // time-of-use — другой поток может создать папку
   }
   ```
   `recursive: true` частично смягчает — `mkdirSync` не падает при существующей папке.
   **Рекомендация:** заменить на `fs.mkdirSync(fullDir, { recursive: true })` без предварительной проверки (он no-op для существующих папок).

2. **Аналогичный TOCTOU** в `getSafeFileInfo` (line 44-46): проверка существования файла через `existsSync` перед отправкой — между проверкой и отправкой файл может быть удалён. Низкий риск, т.к. Fastify stream обработает ENOENT.

3. **Backup CLI (`backup.ts`):** `setInterval` без `clearInterval` — при завершении процесса (SIGTERM) может продолжить выполнение. Флаг `isBackingUp` защищает только от re-entry в рамках одного процесса, не от параллельных запусков (multi-instance).

4. **BullMQ Processor**: `TestQueueProcessor` наследует `WorkerHost` — BullMQ по-умолчанию обрабатывает несколько jobs конкурентно (concurrency). В текущей реализации processor не имеет изоляции между concurrent jobs (разделяет `logger` — безопасно, не разделяет состояние).

### Итог

| Статус | Количество |
|--------|-----------|
| PASS | 3 (CON-01, CON-02, CON-03) |
| FAIL | 3 (CON-04, CON-05, CON-06) |
| Всего проверок | 6 |

**Критичных нарушений нет**. Все FAIL имеют низкий или средний риск:
- CON-04: кэш в dev-only тулзе (DevLauncherController)
- CON-05: test-queue для разработки
- CON-06: механизмы отмены отсутствуют, но все background операции тривиальны

**Рекомендуется исправить** в порядке приоритета:
1. **TOCTOU** в file-upload.service.ts — убрать лишний `existsSync` перед `mkdirSync`
2. **Инвалидация кэша** DevLauncherController — добавить TTL (e.g. 5 min) или отказаться от кэша
3. **Механизм отмены** — добавить `AbortController` для долгих операций (если появятся)
4. **Идемпотентность** — для production-очередей использовать dedup keys

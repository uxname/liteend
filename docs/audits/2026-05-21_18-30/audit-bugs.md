# Audit Report: Bugs & Logic Errors — 2026-05-21 18:30

| Check ID | Проверка | Статус | Уверенность | Доказательство | Решение | Исправлено |
|----------|----------|--------|-------------|----------------|---------|------------|
| BUG-01 | Преобразования типов безопасны (NaN, radix, coercion) | ✅ PASS | High | Все `Number.parseInt()` в кодовой базе используют radix 10. NaN-guard присутствует в `logger-serve.controller.ts:97-98`. Coercion не используется (везде `===`). | — | — |
| BUG-02 | async/await используется корректно (нет await в forEach, нет if(asyncFn())) | ✅ PASS | High | Нет `await` внутри `forEach`. `if (asyncFn())` не обнаружено. `for await...of` в `file-upload.controller.ts:57` используется корректно для асинхронного итератора. | — | — |
| BUG-03 | Null-safety соблюдается — обращения к свойствам защищены от undefined/null | ❌ FAIL 🟡 | Medium | **1)** `src/common/auth/current-user.decorator.ts:14` — `return httpRequest.user` может вернуть `undefined`, но тип функции — `CurrentUserType = Profile` (non-nullable). **2)** Там же `ctx.getContext().req` (строка 10) без optional chaining, хотя проверка `if (!request)` спасает от NPE. | **1)** Добавить проверку `if (!httpRequest.user) throw new UnauthorizedException()` или изменить возвращаемый тип на `CurrentUserType \| undefined`. | Нет |
| BUG-04 | Функции не мутируют входные аргументы (sort, splice, object spread) | ✅ PASS | High | `sort()` вызывается только на локально созданных массивах (результат `.map()`, `.filter()`). Нет мутации внешних объектов. | — | — |
| BUG-05 | Exhaustive handling — все enum/union-ветки обработаны | ✅ PASS | High | В production-коде нет операторов `switch`. Цепочки `if-else` в `error-formatter.ts` и `all-exceptions-filter.ts` корректно обрабатывают все известные типы исключений с fallback. | — | — |
| BUG-06 | Математические guard-условия (деление на ноль, граничные значения) | ✅ PASS | High | Деление на ноль не обнаружено. NaN-guard есть в `logger-serve.controller.ts:97-98`. | — | — |
| BUG-07 | Off-by-one: границы диапазонов корректны | ✅ PASS | High | Месяц корректно инкрементирован: `getMonth() + 1`. Сравнение `start > totalSize` (не `>=`) корректно. | — | — |
| BUG-08 | Float comparison не использует === для проверки равенства | ✅ PASS | High | Сравнений float через `===` не обнаружено. | — | — |
| BUG-09 | Дата/время хранятся и обрабатываются в UTC, не локальном времени | ❌ FAIL 🟠 | High | `src/modules/file-upload/file-upload.service.ts:95-100`: Используются `getFullYear()`, `getMonth()`, `getDate()`, `getHours()`, `getMinutes()` вместо UTC-вариантов. Структура директорий для загруженных файлов зависит от локальной timezone сервера. | Заменить на `getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`, `getUTCHours()`, `getUTCMinutes()`. | Нет |
| BUG-10 | RegExp с user input не содержит катастрофического backtracking (ReDoS) | ✅ PASS | High | `new RegExp()` / `new Regex()` с динамическим user input не обнаружено. Все regex — статические литералы. | — | — |

## Дополнительные находки

| ID | Описание | Файл | Серьёзность | Решение |
|----|----------|------|-------------|---------|
| EXT-01 | `CurrentUser` декоратор может вернуть `undefined` при использовании без guard | `src/common/auth/current-user.decorator.ts:14` | 🟡 Средняя | Явно проверить наличие user перед возвратом |
| EXT-02 | `Number.parseInt` без проверки NaN для `REDIS_PORT` | `src/common/redis/redis.service.ts:11`, `src/app.module.ts:90` | 🟢 Низкая | Добавить `Number.isNaN()` guard или заменить на `Number()` с валидацией |
| EXT-03 | Schema Prisma не содержит `url` в datasource | `prisma/schema.prisma:4-6` | 🟢 Инфо | URL конструируется программно в `prisma.service.ts`. OK для текущей архитектуры. |
| EXT-04 | Использование `as unknown as` для обхода типов | `src/common/prisma/prisma.service.ts:25`, `src/common/logger/pino-config.ts:103` | 🟢 Низкая | Документировано TODO-комментариями. |
| EXT-05 | `console.error` в bootstrap и git-commit-saver | `src/main.ts:39`, `src/common/git-commit-saver.ts` | 🟢 Низкая | В bootstrap это fallback при старте (до инициализации логгера). Допустимо. |

## Audit Coverage

**Проверено по чеклисту:**
- `src/common/auth/**` — 7 production-файлов
- `src/common/prisma/**` — 2 файла
- `src/common/all-exceptions-filter.ts` — 1 файл
- `src/modules/file-upload/**` — 3 файла
- `src/modules/profile/**` — 6 файлов (включая types/)
- `src/bootstrap/setup-app.ts` — 1 файл
- `src/common/graphql/**` — 1 файл
- `src/infrastructure/test-queue/**` — 3 файла
- `src/infrastructure/health/**` — 3 файла
- `src/common/real-ip/**` — 1 файл
- `src/common/redis/**` — 2 файла
- `src/common/dotenv-validator/**` — 2 файла
- `src/common/logger/**` — 3 файла
- `src/main.ts` — 1 файл
- `prisma/schema.prisma` — 1 файл
- Дополнительно: `src/app.module.ts`, `src/common/git-commit-saver.ts`, `src/dev-tools/debug/debug.resolver.ts`, `src/dev-tools/logger-serve/logger-serve.controller.ts`

**Файлов проверено:** 40 production-файлов (без учёта spec-файлов и UI HTML-шаблонов)
**Пройдено проверок:** 8 из 10
**Найдено ошибок:** 2 (BUG-03 🟡, BUG-09 🟠)

## Резюме

Кодовая база в целом качественная: TypeScript strict mode, обязательный radix, корректное использование async/await, отсутствие мутаций входных аргументов. Две найденные проблемы:

1. **BUG-09 (Высокая уверенность):** Использование локального времени вместо UTC в `file-upload.service.ts` для формирования путей загрузки. Это может привести к неконсистентной структуре директорий при работе сервера в разных часовых поясах.

2. **BUG-03 (Средняя уверенность):** `CurrentUser` декоратор возвращает `Profile` (non-nullable), но может вернуть `undefined` при отсутствии аутентификации. Проблема смягчена тем, что декоратор всегда используется с `@UseGuards(JwtAuthGuard)`, но тип не отражает этого контракта.

Рекомендуется исправить BUG-09 (замена на UTC-методы) и BUG-03 (явная проверка или изменение типа).

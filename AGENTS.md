# AGENTS.md

This file is a concise, repo-accurate guide for agentic coding assistants working in this repository.
It summarizes the commands, conventions, and constraints inferred from configuration files and code.

## Quick Commands (Build/Run)

- **Build**: `npm run build`
  - Runs `save-commit-info`, lint, and Nest build.
- **Dev server**: `npm run start:dev`
- **Debug server**: `npm run start:debug`
- **Prod server**: `npm run start:prod`
  - `prestart:prod` runs `npm run db:migrations:apply` automatically.

## Lint / Format / Type Check

- **Lint (Biome)**: `npm run lint`
- **Lint + fix**: `npm run lint:fix`
- **Lint + fix (unsafe)**: `npm run lint:fix:unsafe`
- **Type check**: `npm run ts:check`
- **Full check**: `npm run check` (type check + lint:fix + knip)

**Pre-commit hooks** (`lefthook.yml`):
- `pre-commit` (parallel): runs `npm run check` + `npm run test` (unit)
- `pre-push`: runs `npm run test:cov` — blocks push if coverage drops below 80%

Do not bypass hooks unless explicitly asked.

## Tests (Vitest)

- **Unit tests**: `npm run test`
- **Watch mode**: `npm run test:watch`
- **Coverage**: `npm run test:cov`
- **E2E tests**: `npm run test:e2e`
- **All tests**: `npm run test:all`

**Run a single unit test file (use npm scripts to preserve `VITEST_TARGET`)**:

```bash
npm run test -- src/modules/profile/profile.service.spec.ts
```

**Run a single E2E test file**:

```bash
npm run test:e2e -- test/app.e2e.spec.ts
```

## Environment & Infra

**Docker services (recommended for local dev):**

```bash
docker-compose up -d db redis
```

**Prisma workflows:**

- `npm run db:migrations:apply`
- `npm run db:migrations:create`
- `npm run db:gen`
- `npm run db:reset`
- `npm run db:schema:format`
- `npm run db:seed`

## Code Style & Conventions

### Formatting & Imports (Biome)

- Biome is the formatter and linter.
- Quotes: **single** (`'`)
- Indent: **spaces**
- Line endings: **LF**
- Imports are organized by Biome on format.
- Unused imports/vars/params are **errors**.

### TypeScript Strictness

- `strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`
- `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`
- Prefer explicit return types where inference is unclear

### Naming & Structure (NestJS)

- Modules: `*.module.ts`
- Services: `*.service.ts`
- Controllers: `*.controller.ts`
- Resolvers: `*.resolver.ts`
- Feature modules live under `src/app/` and shared/common code under `src/common/`.

### Architecture Boundaries

- **Thin Controllers/Resolvers:** Handle ONLY HTTP/GraphQL specifics (decorators, extracting inputs). No business logic, no `if/else` on domain data.
- **Fat Services:** All business logic, Prisma calls, and external integrations live here.
- **Validation:** Use `nestjs-zod` for all DTOs and GraphQL Inputs. Never validate manually inside services.
- **Imports:** ALWAYS use the `@/` alias for internal imports (maps to `src/`). Never use relative paths like `../../`.

### Patterns

- Prefer small, focused functions.
- Keep dependencies explicit (Nest DI, constructor injection).
- Avoid mutation and hidden side effects where possible.

### Testing Rules (Strict!)

- **TDD is mandatory:** Write the test BEFORE the implementation (Red → Green → Refactor).
- **Framework:** ALWAYS use `vitest`. Never use `jest`.
- **Test placement by layer:**
  - Controllers and Resolvers → E2E tests only (`test/<name>.e2e.spec.ts`)
  - Services → Unit tests only (`src/modules/<name>/<name>.service.spec.ts`)
- **E2E Tests:** Do NOT use `supertest`, `pactum`, or `axios`. Always use `E2EClient` and `createTestingApp` from `test/utils/` (Fastify inject).
- **Mocking:** Do NOT use `as unknown as Type` in tests. Always use `mock<T>()` or `mockDeep<T>()` from `vitest-mock-extended`.
- **Test Data:** Do NOT call `prisma.model.create()` directly in tests. Use factories from `test/factories/` (e.g. `createProfile`, `createUpload`). If a factory for a model doesn't exist, create it first.
- **RBAC testing:** Use `client.loginAs(user)` to authenticate as a specific factory-created profile. Use `client.logout()` to reset.
- **File uploads:** Use `client.uploadFile(url, filename, buffer, mimetype)` — do NOT construct `multipart/form-data` manually.
- **AAA Pattern:** Follow Arrange-Act-Assert strictly. Do NOT use `if/else` logic inside tests.
- **Context Mocks:** For `ExecutionContext` and `ArgumentsHost`, use factories from `test/utils/mocks.ts`.
- **Coverage threshold:** Lines / Functions / Branches / Statements must stay ≥ 80%. Check with `npm run test:cov`.

## Error Handling & Logging

- Global exception handling uses `AllExceptionsFilter`.
- Throw `HttpException` subclasses for HTTP errors.
- Non-HTTP errors should be logged and mapped to consistent error shapes.
- Logging uses `nestjs-pino`; avoid `console.*` outside bootstrap error handling.

## Configuration & Validation

- Configuration is via `@nestjs/config` and `.env` files.
- Use `ConfigService.getOrThrow()` for required envs.
- Validation uses `nestjs-zod` + `ZodValidationPipe`.

## Copilot Rules

No Copilot rules (`.github/copilot-instructions.md`) are used in this repo.

## Skills

Skills live in `.agents/skills/`. Each skill is a `SKILL.md` file that guides agents through a specific workflow.

**All skill content must be written in English only.** This applies to descriptions, instructions, comments, and any other text inside SKILL.md files.

## Do / Don’t for Agents

**Do**
- Write tests BEFORE implementation (TDD: Red → Green → Refactor).
- Use `npm run check` before commit.
- Use Biome to format and organize imports.
- Follow NestJS module/service/controller/resolver patterns.
- Prefer explicit types at boundaries (DTOs, config, external IO).
- Use `vitest-mock-extended` (`mockDeep`) for mocking dependencies.
- Use `E2EClient` (Fastify inject) for all E2E testing.
- Use factories (`test/factories/`) to create test data in E2E tests.
- Follow the AAA (Arrange-Act-Assert) pattern in specs.
- Keep Controllers/Resolvers thin — business logic belongs in Services.

**Don’t**
- Write production code before writing the failing test.
- Bypass lefthook/pre-commit checks unless explicitly asked.
- Introduce unused imports/variables (Biome treats them as errors).
- Add undocumented scripts or commands not present in package.json.
- Run `npm run lint` or `npm run ts:check` separately — always use `npm run check` (runs both + knip).
- Use `as unknown as` to bypass TypeScript in tests.
- Use `pactum`, `supertest`, or bind real ports in E2E tests.
- Write conditional logic (`if/else`) inside test assertions.
- Call `prisma.model.create()` directly in tests — use factories instead.
- Put business logic in Controllers or Resolvers.
- Use relative paths (`../../`) for internal imports — use `@/` alias.

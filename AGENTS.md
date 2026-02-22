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

**Pre-commit hooks**: `lefthook.yml` runs `npm run check` on commit.
Do not bypass hooks unless explicitly asked.

## Tests (Vitest)

- **Unit tests**: `npm run test`
- **Watch mode**: `npm run test:watch`
- **Coverage**: `npm run test:cov`
- **E2E tests**: `npm run test:e2e`
- **All tests**: `npm run test:all`

**Run a single test file**:

```bash
npx vitest run test/unit/profile.service.spec.ts
```

**Run a single test by name**:

```bash
npx vitest -t "should create profile"
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

### Patterns

- Prefer small, focused functions.
- Keep dependencies explicit (Nest DI, constructor injection).
- Avoid mutation and hidden side effects where possible.

## Error Handling & Logging

- Global exception handling uses `AllExceptionsFilter`.
- Throw `HttpException` subclasses for HTTP errors.
- Non-HTTP errors should be logged and mapped to consistent error shapes.
- Logging uses `nestjs-pino`; avoid `console.*` outside bootstrap error handling.

## Configuration & Validation

- Configuration is via `@nestjs/config` and `.env` files.
- Use `ConfigService.getOrThrow()` for required envs.
- Validation uses `nestjs-zod` + `ZodValidationPipe`.

## Cursor / Copilot Rules

No Cursor rules (`.cursor/rules/`, `.cursorrules`) or Copilot rules
(`.github/copilot-instructions.md`) were found in this repo.

## Do / Don’t for Agents

**Do**
- Use `npm run check` before commit.
- Use Biome to format and organize imports.
- Follow NestJS module/service/controller/resolver patterns.
- Prefer explicit types at boundaries (DTOs, config, external IO).

**Don’t**
- Bypass lefthook/pre-commit checks unless explicitly asked.
- Introduce unused imports/variables (Biome treats them as errors).
- Add undocumented scripts or commands not present in package.json.

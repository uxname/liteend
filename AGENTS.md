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
- **Full check**: `npm run check` (type check + lint:fix + knip --production)

### IMPORTANT — Quality Gate Rule

- **Always** use `npm run check` for the full quality gate.
- **Never** call `npm run lint && npm run ts:check` separately — this skips knip and biome auto-fix, causing pre-commit (lefthook) to fail. Rely on `npm run check` exclusively.

**Pre-commit hooks** (`lefthook.yml`):
- `pre-commit`: runs `gitleaks` (optional, silently skipped if not installed) + `npm run check`
- `pre-push`: runs `npm run check` + `npm run test:all`

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

- `npm run db:migrations:apply` (deploy + gen)
- `npm run db:migrations:create`
- `npm run db:push` (push + gen)
- `npm run db:gen` (generate client)
- `npm run db:reset`
- `npm run db:schema:format`
- `npm run db:seed`
- `npm run db:studio` (Prisma Studio on port 5555)

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
- Feature modules live under `src/modules/`, infrastructure under `src/infrastructure/`, and shared/common code under `src/common/`.

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
- Use `as unknown as` to bypass TypeScript in tests.
- Use `pactum`, `supertest`, or bind real ports in E2E tests.
- Write conditional logic (`if/else`) inside test assertions.
- Call `prisma.model.create()` directly in tests — use factories instead.
- Put business logic in Controllers or Resolvers.
- Use relative paths (`../../`) for internal imports — use `@/` alias.

<!-- CODEGRAPH_START -->
## CodeGraph

This project has a CodeGraph MCP server (`codegraph_*` tools) configured. CodeGraph is a tree-sitter-parsed knowledge graph of every symbol, edge, and file. Reads are sub-millisecond and return structural information grep cannot.

### When to prefer codegraph over native search

Use codegraph for **structural** questions — what calls what, what would break, where is X defined, what is X's signature. Use native grep/read only for **literal text** queries (string contents, comments, log messages) or after you already have a specific file open.

| Question | Tool |
|---|---|
| "Where is X defined?" / "Find symbol named X" | `codegraph_search` |
| "What calls function Y?" | `codegraph_callers` |
| "What does Y call?" | `codegraph_callees` |
| "How does X reach/become Y? / trace the flow from X to Y" | `codegraph_trace` (one call = the whole path, incl. callback/React/JSX dynamic hops) |
| "What would break if I changed Z?" | `codegraph_impact` |
| "Show me Y's signature / source / docstring" | `codegraph_node` |
| "Give me focused context for a task/area" | `codegraph_context` |
| "See several related symbols' source at once" | `codegraph_explore` |
| "What files exist under path/" | `codegraph_files` |
| "Is the index healthy?" | `codegraph_status` |

### Rules of thumb

- **Answer directly — don't delegate exploration.** For "how does X work" / architecture questions, answer with 2-3 codegraph calls: `codegraph_context` first, then ONE `codegraph_explore` for the source of the symbols it surfaces. For a specific **flow** ("how does X reach Y") start with `codegraph_trace` from→to — one call returns the whole path with dynamic hops bridged — then ONE `codegraph_explore` for the bodies; don't rebuild the path with `codegraph_search` + `codegraph_callers`. Codegraph IS the pre-built index, so spawning a separate file-reading sub-task/agent — or running a grep + read loop — repeats work codegraph already did and costs more for the same answer.
- **Trust codegraph results.** They come from a full AST parse. Do NOT re-verify them with grep — that's slower, less accurate, and wastes context.
- **Don't grep first** when looking up a symbol by name. `codegraph_search` is faster and returns kind + location + signature in one call.
- **Don't chain `codegraph_search` + `codegraph_node`** when you just want context — `codegraph_context` is one call.
- **Don't loop `codegraph_node` over many symbols** — one `codegraph_explore` call returns several symbols' source grouped in a single capped call, while each separate node/Read call re-reads the whole context and costs far more.
- **Index lag**: the file watcher debounces ~500ms behind writes; don't re-query immediately after editing a file in the same turn.

### If `.codegraph/` doesn't exist

The MCP server returns "not initialized." Ask the user: *"I notice this project doesn't have CodeGraph initialized. Want me to run `codegraph init -i` to build the index?"*
<!-- CODEGRAPH_END -->

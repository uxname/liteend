---
name: check-and-fix
description: Run the full liteend code quality pipeline (TypeScript check + Biome lint/format + Knip unused code) and fix all issues found.
---

The user wants to run the full code quality check for the liteend project and fix any issues.

## What the check pipeline does

`npm run check` runs three tools in parallel via `run-p`:

1. **`tsc --noEmit`** — TypeScript type checking (no output files)
2. **`biome check --write`** — Linting + formatting with auto-fix (Biome replaces ESLint + Prettier)
3. **`knip --production`** — Finds unused exports, files, and dependencies

Pre-commit hook (lefthook) runs the same pipeline automatically on every commit.

## Running the check

```bash
npm run check
```

To run tools individually for targeted diagnosis:
```bash
npm run ts:check      # TypeScript only
npm run lint:fix      # Biome with auto-fix
npm run knip          # Knip unused code analysis
```

## Interpreting and fixing common errors

### TypeScript errors

**Missing type on Prisma-generated code:**
- If errors reference `src/@generated/prisma`, run `npm run db:gen` first — the client may be stale

**`declare` keyword on GraphQL InputType fields:**
The project uses `declare` to re-declare Zod DTO fields with GraphQL decorators (see `profile-update.input.ts`):
```typescript
@InputType()
export class MyInput extends MyZodDto {
  @Field(() => String, { nullable: true })
  declare myField?: string;   // ← 'declare' is required, not assignment
}
```

**Import path errors:**
- Always use `@/` alias for internal imports (maps to `src/`)
- Never use relative `../../` paths that cross module boundaries

### Biome errors

Biome auto-fixes most issues with `--write`. Common remaining issues:
- **Unused variables**: prefix with `_` (e.g. `_unusedParam`) or remove them
- **Explicit `any`**: use `unknown` and narrow the type, or add `// biome-ignore lint/suspicious/noExplicitAny: <reason>`
- **Missing return types**: add explicit return type to exported functions

### Knip errors

Knip flags exports that are not imported anywhere in production code (`--production` excludes test files).

**Common false positives to investigate:**
- NestJS module classes exported from `*.module.ts` — these ARE used via `app.module.ts` imports array
- GraphQL types decorated with `@ObjectType()` / `@InputType()` — used by NestJS reflection at runtime
- Enum types used only in GraphQL schema

**When Knip flags something legitimately unused:**
- Remove the export if it's truly dead code
- If it's a public API for external consumers, verify the import chain

## Workflow

1. Run `npm run check` and capture the full output
2. Fix TypeScript errors first (they often cascade)
3. Biome fixes are mostly automatic — review the diff
4. For Knip warnings, investigate each flagged export before removing
5. Re-run `npm run check` until clean
6. If pre-commit hook blocks a commit, the check pipeline is what's failing — fix it here

---
name: check
description: Run the full code quality pipeline (TypeScript + Biome + Knip), fix all issues, and clean up comments in changed code.
---

The user wants to verify and fix all code quality issues in the project.

## What the pipeline checks

`npm run check` runs three tools in parallel via `run-p`:

1. **`tsc --noEmit`** — TypeScript type checking
2. **`biome check --write`** — Linting + formatting with auto-fix
3. **`knip --production`** — Unused exports, files, and dependencies

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

## Fixing common errors

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

## Comment cleanup

After fixing tool errors, review all changed/created code for comment quality:

1. **Remove unnecessary comments** — commented-out dead code, obvious statements (e.g. `// call the function`), outdated TODOs
2. **Ensure remaining comments are in English** — translate or rewrite any non-English comment; if it adds no real value, remove it instead

## Workflow

1. Run `npm run check` and capture the full output
2. Report what was found (errors by tool + comment issues)
3. Fix TypeScript errors first (they often cascade)
4. Biome fixes are mostly automatic — review the diff
5. For Knip warnings, investigate each flagged export before removing
6. Clean up comments in changed/created files
7. Re-run `npm run check` until clean

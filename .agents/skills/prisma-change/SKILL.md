---
name: prisma-change
description: Guide through a full Prisma schema change workflow in the liteend project — edit schema, create migration, regenerate client, update affected services.
---

The user wants to modify the database schema in the liteend project. This is a multi-step workflow where skipping any step causes runtime errors.

## Project-specific Prisma setup

- Schema: `prisma/schema.prisma`
- Generated client output: `src/@generated/prisma` (NOT the default `node_modules`)
- Import path in code: `import { ... } from '@/@generated/prisma/client'`
- Module format: CJS (set in generator config)
- Adapter: `@prisma/adapter-pg` (PostgreSQL)
- Migrations directory: `prisma/migrations/`

## The full workflow

### Step 1 — Edit `prisma/schema.prisma`

Apply the requested model/enum/field changes. Key conventions:
- All models have `id Int @id @default(autoincrement())`
- All models have `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Use `String?` for optional strings, not empty string defaults
- Enum values are SCREAMING_SNAKE_CASE

### Step 2 — Create migration (dev only)

```bash
npm run db:migrations:create -- --name <migration-name>
```

This creates a new migration file in `prisma/migrations/` without applying it yet.
Use a descriptive kebab-case name, e.g. `add-user-email` or `add-posts-model`.

> In production, migrations are applied via `npm run db:migrations:apply` (runs `prisma migrate deploy`).
> In development, use `npm run db:push` only for fast prototyping (no migration file created).

### Step 3 — Regenerate Prisma client

```bash
npm run db:gen
```

This runs `prisma generate --no-hints` and outputs the client to `src/@generated/prisma`.
**Always run this after any schema change** — TypeScript types come from here.

### Step 4 — Update affected application code

After regenerating the client, check and update:
- Services that use `PrismaService` and reference the changed model
- GraphQL `@ObjectType` classes in `src/modules/<module>/types/*.object-type.ts` — these are hand-written and must be kept in sync with the Prisma schema manually
- Enum types in `types/*-role.enum.ts` or similar — must match Prisma enums

**Important:** The Prisma-generated types in `src/@generated/prisma/client` and the GraphQL `@ObjectType` classes are separate. The GraphQL types are NOT auto-generated — update them manually.

### Step 5 — Verify

```bash
npm run check
```

Fix any TypeScript, Biome, or Knip errors before proceeding.

## Common patterns

**Adding a field to an existing model:**
1. Add field to schema
2. Create migration: `npm run db:migrations:create -- --name add-<field>-to-<model>`
3. Regenerate: `npm run db:gen`
4. Update the corresponding `@ObjectType` class to add the `@Field()` decorator
5. Update any service methods that select or return the model

**Adding a new model:**
1. Add model to schema
2. Create migration: `npm run db:migrations:create -- --name add-<model-name>-model`
3. Regenerate: `npm run db:gen`
4. Create module files (use `/new-module` skill)

**Adding an enum:**
1. Add enum to schema
2. Add field referencing enum to the relevant model
3. Create migration
4. Regenerate client
5. Create enum file: `src/modules/<module>/types/<name>.enum.ts` with `registerEnumType`

## Enum file pattern

```typescript
import { registerEnumType } from '@nestjs/graphql';

export enum <EnumName> {
  VALUE_ONE = 'VALUE_ONE',
  VALUE_TWO = 'VALUE_TWO',
}

registerEnumType(<EnumName>, { name: '<EnumName>', description: undefined });
```

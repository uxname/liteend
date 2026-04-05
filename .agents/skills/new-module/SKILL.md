---
name: new-module
description: Scaffold a new NestJS business module in the project following the project's file structure, naming, and import conventions.
---

The user wants to create a new NestJS module for the project. They will provide the module name and whether it should expose a GraphQL resolver, a REST controller, or both.

## Project Conventions

**File placement:**
- Business modules live in `src/modules/<module-name>/`
- Infrastructure modules live in `src/infrastructure/<module-name>/`
- Use the business path (`src/modules/`) unless the user specifies otherwise

**File naming (kebab-case):**
```
src/modules/<name>/
  <name>.module.ts
  <name>.service.ts
  <name>.resolver.ts      (if GraphQL)
  <name>.controller.ts    (if REST)
  types/
    <name>.object-type.ts (GraphQL @ObjectType)
    <name>.input.ts       (GraphQL @InputType with Zod validation)
  <name>.service.spec.ts  (unit tests for service)
test/
  <name>.e2e.spec.ts      (E2E tests for resolver/controller)
```

**Imports use `@/` alias** (maps to `src/`), e.g. `import { PrismaService } from '@/common/prisma/prisma.service'`

## File Templates

### `<name>.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { <Name>Resolver } from './<name>.resolver';
import { <Name>Service } from './<name>.service';

@Module({
  providers: [<Name>Service, <Name>Resolver],
  exports: [<Name>Service],
})
export class <Name>Module {}
```
Add `imports: [PrismaModule]` only if using Prisma directly in the module (PrismaModule is global so usually not needed).

### `<name>.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class <Name>Service {
  constructor(private readonly prisma: PrismaService) {}
}
```

### `<name>.resolver.ts` (GraphQL)
```typescript
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserType } from '@/common/auth/current-user.decorator';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/roles.guard';
import { <Name>Service } from './<name>.service';
import { <Name> } from './types/<name>.object-type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Resolver(() => <Name>)
export class <Name>Resolver {
  constructor(private readonly <name>Service: <Name>Service) {}
}
```

### `types/<name>.object-type.ts` and `types/<name>.input.ts`

Use the `/add-graphql-type` skill for templates and conventions for `@ObjectType`, `@InputType`, and enum types.

### `<name>.controller.ts` (REST)
```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/auth/jwt-auth.guard';
import { <Name>Service } from './<name>.service';

@ApiTags('<name>')
@Controller('<name>')
export class <Name>Controller {
  constructor(private readonly <name>Service: <Name>Service) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get <name>' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async get<Name>() {
    // ...
  }
}
```

Add controller to module (use `controllers`, not `providers`):
```typescript
@Module({
  controllers: [<Name>Controller],
  providers: [<Name>Service],
  exports: [<Name>Service],
})
```

### `<name>.service.spec.ts` and `test/<name>.e2e.spec.ts`

Use the `/add-tests` skill for unit test templates and patterns.
Use the `/add-e2e-test` skill for E2E test templates.

## Registration in AppModule

After creating the module files, add the module to `src/app.module.ts`:
1. Import the module class at the top
2. Add it to the `imports` array in `@Module()`

```typescript
import { <Name>Module } from '@/modules/<name>/<name>.module';

@Module({
  imports: [
    // ... existing imports
    <Name>Module,
  ],
})
```

## Steps

1. Read the existing `src/app.module.ts` to understand the current imports list
2. Create all necessary files based on user requirements (resolver vs controller vs both)
3. Register the module in `app.module.ts`
4. Use `/add-tests` to create the unit test and `/add-e2e-test` to create the E2E test
5. Run `npm run check` from the project root to verify types and linting pass

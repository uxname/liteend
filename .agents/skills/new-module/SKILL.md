---
name: new-module
description: Scaffold a new NestJS business module in the liteend project following the project's file structure, naming, and import conventions.
---

The user wants to create a new NestJS module for the liteend project. They will provide the module name and whether it should expose a GraphQL resolver, a REST controller, or both.

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
  <name>.spec.ts          (unit tests for service + resolver/controller)
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

### `types/<name>.object-type.ts`
```typescript
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class <Name> {
  @Field(() => Int, { nullable: false })
  id!: number;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
}
```

### `types/<name>.input.ts` (GraphQL InputType with Zod)
```typescript
import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const <Name>InputSchema = z.object({
  // define fields here
});

class <Name>ZodDto extends createZodDto(<Name>InputSchema) {}

@InputType()
export class <Name>Input extends <Name>ZodDto {
  @Field(() => String, { nullable: true })
  declare someField?: string;
}
```

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

### `<name>.spec.ts` (unit test pattern)
```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { <Name>Service } from './<name>.service';

describe('<Name>Service', () => {
  let service: <Name>Service;

  const mockPrisma = {
    <modelName>: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new <Name>Service(mockPrisma as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // write tests here
});
```

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
4. Run `npm run check` from the project root to verify types and linting pass

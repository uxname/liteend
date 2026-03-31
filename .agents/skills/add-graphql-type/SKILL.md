---
name: add-graphql-type
description: Add a new GraphQL ObjectType, InputType, or Enum to the liteend project following its code-first (NestJS + Mercurius) conventions.
---

The user wants to add a new GraphQL type to the liteend project. They may be adding an `@ObjectType`, `@InputType`, an enum, or a combination.

## Project GraphQL setup

- Driver: Mercurius (not Apollo) via `@nestjs/mercurius`
- Approach: **code-first** — schema is auto-generated from TypeScript decorators
- Schema file: auto-generated in memory (`autoSchemaFile: true`)
- GraphQL IDE: Altair at `/altair`
- JSON scalar: `GraphQLJSON` from `graphql-type-json` is registered globally as `JSON`
- Subscriptions: available via `pubSub.publish/subscribe` with Redis emitter

**Important:** GraphQL types are hand-written and separate from Prisma-generated types. They do NOT auto-sync. When a Prisma model changes, update the corresponding GraphQL type manually.

## File placement

Types live in a `types/` subdirectory inside the module:
```
src/modules/<module>/types/
  <name>.object-type.ts
  <name>.input.ts
  <name>.enum.ts
```

## Templates

### `@ObjectType` — response type

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

  @Field(() => String, { nullable: false })
  someField!: string;

  @Field(() => String, { nullable: true })
  optionalField!: string | null;
}
```

Field type mapping:
| TypeScript | GraphQL decorator |
|---|---|
| `number` (Int) | `() => Int` |
| `number` (Float) | `() => Float` |
| `string` | `() => String` |
| `boolean` | `() => Boolean` |
| `Date` | `() => Date` |
| `T[]` | `() => [T]` |
| arbitrary JSON | `() => GraphQLJSON` (import from `graphql-type-json`) |

### `@InputType` — mutation argument (with Zod validation)

```typescript
import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const <Name>Schema = z.object({
  requiredField: z.string().min(1),
  optionalUrl: z.url().optional(),
  optionalString: z.string().optional(),
});

class <Name>ZodDto extends createZodDto(<Name>Schema) {}

@InputType()
export class <Name>Input extends <Name>ZodDto {
  @Field(() => String, { nullable: false })
  declare requiredField: string;

  @Field(() => String, { nullable: true })
  declare optionalUrl?: string;
}
```

**Critical:** Use `declare` (not assignment) when re-declaring Zod DTO properties. This is required to avoid overriding the Zod class instance properties.

### Enum type

```typescript
import { registerEnumType } from '@nestjs/graphql';

export enum <EnumName> {
  VALUE_ONE = 'VALUE_ONE',
  VALUE_TWO = 'VALUE_TWO',
}

registerEnumType(<EnumName>, {
  name: '<EnumName>',
  description: undefined,
});
```

Use the enum in `@ObjectType` fields:
```typescript
import { <EnumName> } from './types/<name>.enum';

// in @ObjectType:
@Field(() => [<EnumName>], { nullable: true })
roles!: Array<keyof typeof <EnumName>>;
```

### Connecting to a resolver

After creating the type, use it in a resolver:
```typescript
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { <Name> } from './types/<name>.object-type';
import { <Name>Input } from './types/<name>.input';

@Resolver(() => <Name>)
export class <Name>Resolver {
  @Query(() => <Name>, { name: '<queryName>' })
  async get<Name>(): Promise<<Name>> { ... }

  @Mutation(() => <Name>)
  async update<Name>(
    @Args('input') input: <Name>Input,
  ): Promise<<Name>> { ... }
}
```

### Subscription pattern

```typescript
import { Subscription, Context } from '@nestjs/graphql';
import { PubSub } from 'mercurius';

const EVENTS = {
  <NAME>_UPDATED: '<name>Updated',
};

@Subscription(() => <Name>, {
  name: EVENTS.<NAME>_UPDATED,
  filter: (payload, _variables, context) => {
    // return true to deliver to this subscriber
    return payload.<name>Updated.id === context.req?.user?.id;
  },
})
<name>Updated(@Context('pubsub') pubSub: PubSub) {
  return pubSub.subscribe(EVENTS.<NAME>_UPDATED);
}

// Publishing (in a mutation):
pubSub.publish({
  topic: EVENTS.<NAME>_UPDATED,
  payload: { <name>Updated: result },
});
```

## Steps

1. Determine which type(s) are needed (ObjectType, InputType, enum)
2. Create the type file(s) in the appropriate `types/` directory
3. Import and use the type in the module's resolver
4. Run `npm run ts:check` to verify the types are correct

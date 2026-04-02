---
name: add-tests
description: Write unit tests for an existing NestJS service, resolver, or controller in the project following its Vitest + NestJS Testing conventions.
---

The user wants to write unit tests for one or more existing files in the project. They will provide the file path(s) to test.

## Test framework & setup

- **Runner:** Vitest (`npm test` → `vitest run` with `VITEST_TARGET=unit`)
- **Unit test location:** co-located with source, `<name>.spec.ts` next to `<name>.ts`
- **Globals:** `describe`, `it`, `expect`, `beforeEach`, `afterEach`, `vi` are available globally (no need to import them, but some existing files do import from vitest — both styles work)
- **NestJS testing:** use `@nestjs/testing` `Test.createTestingModule` to wire up dependencies
- **Mocking utilities:** `test/utils/mocks.ts` provides helpers:
  - `mock<T>()` — shallow mock (each property becomes a `vi.fn()`)
  - `createPrismaMock()` — deep mock for `PrismaClient`
  - `createProfileServiceMock()` — deep mock for `ProfileService`
  - `createPubSubMock()` — shallow mock for Mercurius `PubSub`
  - `createJobMock()` — deep mock for BullMQ `Job`
  - Add new `createXxxMock()` factories to this file when they would be reused across multiple spec files

## Steps

1. **Read the source file** to understand its public methods, injected dependencies, and any guard/decorator usage
2. **Identify dependencies** — note what is injected in the constructor (typically `PrismaService`, other services)
3. **Choose mock strategy:**
   - For `PrismaService`: use `createPrismaMock()` or a targeted inline object with only the needed Prisma model methods as `vi.fn()`
   - For other services: use `mockDeep<ServiceType>()` via `createXxxMock()` from `test/utils/mocks.ts`, or inline `{ methodName: vi.fn() }`
   - For guards (`JwtAuthGuard`, `RolesGuard`): override with `.overrideGuard(Guard).useValue({ canActivate: vi.fn().mockReturnValue(true) })`
4. **Write the spec file** following the structure below
5. **Run tests** to verify they pass:
   ```bash
   npm test -- <path/to/file.spec.ts>
   ```
6. If tests fail, read the error and fix — do NOT skip or comment out failing tests
7. Run `npm run check` to verify the new test file passes linting and type checking.

## Spec file structure

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { <ClassName> } from './<name>';
import { PrismaService } from '@/common/prisma/prisma.service';
// import other deps as needed

describe('<ClassName>', () => {
  let subject: <ClassName>;

  const mockPrismaService = {
    <modelName>: {
      findUnique: vi.fn(),
      update: vi.fn(),
      // only mock methods actually used
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        <ClassName>,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    subject = module.get(<ClassName>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('<methodName>', () => {
    it('should <description of the happy path>', async () => {
      // arrange
      mockPrismaService.<model>.<method>.mockResolvedValue(<fixture>);

      // act
      const result = await subject.<methodName>(<args>);

      // assert
      expect(result).toEqual(<expected>);
      expect(mockPrismaService.<model>.<method>).toHaveBeenCalledWith(<args>);
    });

    it('should <description of error/edge case>', async () => {
      // ...
    });
  });
});
```

## What to test

Cover the following for each public method:
- **Happy path** — normal input, expected output
- **Edge cases** — empty arrays, null/undefined optional fields, boundary values
- **Error paths** — exceptions thrown by dependencies (e.g. Prisma `Record not found`)
- **Side effects** — calls to `pubSub.publish`, queue jobs, external services

Do NOT write tests for:
- NestJS wiring (module registration, dependency injection plumbing)
- Private methods directly
- Framework internals (guards themselves are tested in their own spec files)

## Resolver-specific notes

- Override guards using `.overrideGuard()` as shown above
- Pass `currentUser` directly as a plain object matching the `Profile` shape (not from a mock)
- For subscriptions, test the `filter` function inline as a plain function (see `profile.resolver.spec.ts` for an example)

## Import style

- Use `@/` alias for all non-relative imports (maps to `src/`)
- Import test fixtures from `@/@generated/prisma/client` for Prisma model types

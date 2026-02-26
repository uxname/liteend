# Test Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the brittle Pactum-based tests with deterministic, AAA-aligned suites plus type-safe unit mocks that match NestJS best practices.

**Architecture:** Stand up a shared NestFastify test harness that mirrors `main.ts`, wrap Fastify `inject` with a typed client, and introduce centralized DB/Redis fixtures so every spec starts clean. Unit specs adopt Vitest mock helpers and reuse ExecutionContext factories to remove `as unknown as` casts.

**Tech Stack:** NestJS 11, Fastify 5, Vitest 4, Prisma, Redis (ioredis), vitest-mock-extended, TypeScript strict mode.

---

### Task 1: Add shared Fastify testing harness

**Files:**
- Create: `test/utils/testing-app.ts`
- Create: `test/utils/e2e-client.ts`
- Modify: `package.json` (ensure `test`/`test:e2e` include new setup if needed)

**Step 1: Write the failing test utility spec**

```ts
// test/utils/testing-app.spec.ts
it('should init Nest app without listen', async () => {
  const { app } = await createTestingApp();
  expect(app.getHttpServer).toBeDefined();
});
```

**Step 2: Run test to see failure**

Run: `npm run test -- testing-app` (Vitest should throw module not found for helper).

**Step 3: Implement `createTestingApp` and `E2EClient`**

```ts
// test/utils/testing-app.ts
export async function createTestingApp() {
  process.env.NODE_ENV = 'test';
  process.env.OIDC_MOCK_ENABLED = 'true';
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter({ logger: false }));
  mirrorMainBootstrap(app);
  await app.init();
  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;
  await fastify.ready();
  return { app, fastify };
}

// test/utils/e2e-client.ts
export class E2EClient {
  constructor(private readonly fastify: FastifyInstance) {}
  async request(opts: InjectOptions) {
    const res = await this.fastify.inject(opts);
    return { statusCode: res.statusCode, headers: res.headers, payload: res.payload, json: () => res.json() };
  }
  async requestGraphQL<T>(query: string, variables?: Record<string, unknown>, headers?: Record<string, string>) {
    const res = await this.fastify.inject({ method: 'POST', url: '/graphql', payload: { query, variables }, headers });
    assertJson(res);
    const body = res.json();
    return { statusCode: res.statusCode, headers: res.headers, data: body.data as T, errors: body.errors };
  }
}
```

**Step 4: Re-run helper tests**

Run: `npm run test -- test/utils/testing-app.spec.ts` → expect PASS.

**Step 5: Commit helper foundation**

```bash
git add test/utils/testing-app.ts test/utils/e2e-client.ts package.json
git commit -m "test: add Fastify inject test harness"
```

### Task 2: Implement database & Redis fixtures

**Files:**
- Create: `test/utils/clear-state.ts`
- Modify: `test/utils/testing-app.ts` (expose prisma/redis handles)
- Modify: `vitest.config.ts` (set `setupFiles` if needed)

**Step 1: Write failing spec for clear state helper**

```ts
// test/utils/clear-state.spec.ts
it('should truncate all tables and flush redis', async () => {
  await clearDatabase(prisma);
  await clearRedis(redis);
  expect(true).toBe(true);
});
```

**Step 2: Run relevant tests**

Run: `npm run test -- clear-state` → expect import errors.

**Step 3: Implement helpers**

```ts
// test/utils/clear-state.ts
export async function clearDatabase(prisma: PrismaClient) {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations';`;
  for (const { tablename } of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`);
  }
}

export async function clearRedis(redis: Redis) {
  await redis.flushall();
}
```

**Step 4: Wire helpers into Vitest lifecycle**

Add `test/setup.ts` to call `createTestingApp`, store handles globally, and invoke `beforeEach(clearState)` / `afterAll(closeHandles)`. Update `vitest.config.ts` with `setupFiles: ['test/setup.ts']`.

**Step 5: Run e2e suite to confirm determinism**

`npm run test:e2e` (should fail until tests updated, but helper should initialize without resource leaks).

### Task 3: Rewrite `test/app.e2e.spec.ts`

**Files:**
- Modify: `test/app.e2e.spec.ts`

**Step 1: Update spec to use shared harness**

```ts
describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let client: E2EClient;

  beforeAll(async () => {
    ({ app, fastify } = await createTestingApp());
    client = new E2EClient(fastify);
  });

  beforeEach(async () => {
    await clearState();
  });
```

**Step 2: Rewrite tests in AAA style**

```ts
it('should report healthy status when dependencies up', async () => {
  // Act
  const response = await client.request({ method: 'GET', url: '/health' });
  const body = response.json();
  // Assert
  expect(response.statusCode).toBe(200);
  expect(body.status).toBe('ok');
  expect(body.info.database.status).toBeDefined();
});
```

**Step 3: Add unauthorized root test**

Use `client.request` to expect 404.

**Step 4: Run targeted e2e tests**

`npm run test:e2e -- app.e2e.spec.ts` → expect PASS.

**Step 5: Commit rewrite**

```bash
git add test/app.e2e.spec.ts
git commit -m "test: rewrite app e2e using inject"
```

### Task 4: Rewrite `test/graphql.e2e.spec.ts`

**Files:**
- Modify: `test/graphql.e2e.spec.ts`

**Step 1: Split success and failure cases**

Create describe blocks for `Echo`, `Debug`, `Profile` etc., each with separate `it` describing behavior.

**Step 2: Remove conditional expectations**

```ts
it('should return echo text when query is valid', async () => {
  const response = await client.requestGraphQL<{ echo: string }>(`query { echo(text: "hello world") }`);
  expect(response.statusCode).toBe(200);
  expect(response.errors).toBeUndefined();
  expect(response.data?.echo).toBe('hello world');
});

it('should return validation error when field missing', async () => {
  const response = await client.requestGraphQL('query { echo }');
  expect(response.errors?.[0].message).toContain('Argument');
});
```

**Step 3: Cover auth-required operations**

Call helper that injects bearer token from mocked OIDC user. Add tests verifying 401 when header absent.

**Step 4: Assert GraphQL error structure**

Check `.errors[0].extensions?.code` if available to ensure determinism.

**Step 5: Run `npm run test:e2e -- graphql.e2e.spec.ts`**

Expect PASS with stable expectations.

### Task 5: Introduce typed mock utilities

**Files:**
- Modify: `package.json` (+ `vitest-mock-extended` dependency)
- Modify: `package-lock.json`
- Create: `test/utils/mocks.ts`

**Step 1: Add dependency**

Run: `npm install -D vitest-mock-extended`.

**Step 2: Expose helpers**

```ts
// test/utils/mocks.ts
export const createJobMock = () => mockDeep<Job>();
export const createExecutionContextMock = () => mock<ExecutionContext>();
```

**Step 3: Add unit tests to ensure mocks behave**

`createJobMock().isDone()` returns default values etc.

**Step 4: Run unit suite**

`npm run test -- test/utils/mocks.spec.ts`.

**Step 5: Commit dependency addition**

```bash
git add package*.json test/utils/mocks.ts
git commit -m "test: add vitest-mock-extended helpers"
```

### Task 6: Refactor `profile.resolver.spec.ts`

**Files:**
- Modify: `src/modules/profile/profile.resolver.spec.ts`

**Step 1: Replace dynamic import with Nest testing module**

```ts
const moduleRef = await Test.createTestingModule({
  providers: [ProfileResolver, { provide: ProfileService, useValue: mockProfileService }, { provide: PUB_SUB, useValue: mockPubSub }],
}).compile();
resolver = moduleRef.get(ProfileResolver);
```

**Step 2: Use typed mocks**

Replace manual `vi.fn()` with `mockDeep<ProfileService>()` to eliminate `as unknown as`.

**Step 3: Enforce AAA comments**

Add `// Arrange // Act // Assert` blocks and rename tests to `should return current user when ...`.

**Step 4: Run targeted spec**

`npm run test -- src/modules/profile/profile.resolver.spec.ts`.

**Step 5: Commit**

```bash
git add src/modules/profile/profile.resolver.spec.ts
git commit -m "test: refactor profile resolver spec"
```

### Task 7: Share ExecutionContext mocks across guard/filter specs

**Files:**
- Create: `test/utils/mock-execution-context.ts`
- Modify: `src/common/auth/roles.guard.spec.ts`
- Modify: `src/common/all-exceptions-filter.spec.ts`

**Step 1: Implement reusable factory**

```ts
export function createHttpExecutionContextMock(requestOverrides?: Partial<Request>) {
  const req = { user: undefined, ...requestOverrides };
  return mockDeep<ExecutionContext>({
    getType: () => 'http',
    switchToHttp: () => ({ getRequest: () => req }),
  });
}
```

**Step 2: Update specs to import helper**

Remove inline mocks, adopt typed ones, and ensure no `as unknown as` remain.

**Step 3: Run affected specs**

`npm run test -- roles.guard.spec.ts all-exceptions-filter.spec.ts`.

**Step 4: Commit helper usage**

`git add test/utils/mock-execution-context.ts src/common/auth/roles.guard.spec.ts src/common/all-exceptions-filter.spec.ts`

**Step 5: Commit message**

`git commit -m "test: share execution context mocks"`

### Task 8: Tighten queue processor/resolver tests

**Files:**
- Modify: `src/infrastructure/test-queue/test-queue.spec.ts`
- Modify: `src/infrastructure/test-queue/test-queue.processor.ts` (inject logger?)

**Step 1: Inject Logger dependency**

Refactor processor constructor to accept `Logger` so tests can spy without casting. Provide default `new Logger(TestQueueProcessor.name)` for production.

**Step 2: Update spec to use `mockDeep<Logger>()`**

```ts
const logger = mockDeep<Logger>();
processor = new TestQueueProcessor(logger);
```

**Step 3: Replace job mocks**

Use `createJobMock()` helper to avoid `as unknown as Job`.

**Step 4: Add failure-path test**

Force `processor` to throw and assert logger `.error` call.

**Step 5: Run spec**

`npm run test -- test-queue.spec.ts` → PASS.

### Task 9: Expand coverage for FileUploadService & HealthController

**Files:**
- Modify/Create: `src/modules/file-upload/file-upload.service.spec.ts`
- Create: `src/infrastructure/health/health.controller.spec.ts`

**Step 1: Write failing tests**

```ts
it('should throw InternalServerError when fs write fails', async () => {
  vi.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('disk full'));
  await expect(service.processFile(mockFile)).rejects.toThrow('disk full');
});

it('should report redis timeout gracefully', async () => {
  redisClient.status = 'waiting';
  const result = await controller.health();
  expect(result.status).toBe('error');
});
```

**Step 2: Implement minimal code changes if required**

Adjust service/controller to surface errors predictably (e.g., wrap exceptions in HttpException).

**Step 3: Run targeted specs**

`npm run test -- file-upload.service.spec.ts health.controller.spec.ts`.

**Step 4: Update docs if new behaviors introduced**

Add notes to `readme.md` if API contract changes.

**Step 5: Commit coverage additions**

`git add src/modules/file-upload/file-upload.service.spec.ts src/infrastructure/health/health.controller.spec.ts`.

### Task 10: Global test hygiene & verification

**Files:**
- Modify: `.eslintrc`/`biome` if needed for AAA comments
- Modify: `README.md` (document testing commands)

**Step 1: Search for remaining `as unknown as` in tests**

Run: `rg "as unknown as" test src --stats` and address any stragglers, documenting justified exceptions.

**Step 2: Ensure AAA comments**

Add `// Arrange // Act // Assert` markers where missing.

**Step 3: Run full suite**

`npm run test:all` (should pass cleanly).

**Step 4: Update README testing section**

Explain new helpers and deterministic setup.

**Step 5: Final commit**

`git add . && git commit -m "test: stabilize suites with Fastify inject"`

---

Plan complete and saved to `docs/plans/2026-02-26-test-refactor-design.md`. Two execution options:

1. **Subagent-Driven (this session)** – I dispatch a fresh subagent per task, review between tasks for tight feedback loops.
2. **Parallel Session (separate)** – Start a new session dedicated to implementation using superpowers:executing-plans for batched execution with checkpoints.

Which approach should we take?

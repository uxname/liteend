---
name: add-e2e-test
description: Create an End-to-End (E2E) test for a REST controller or GraphQL resolver using Fastify injection.
---

## Rules
1. Never import `supertest`.
2. Use `E2EClient` and `createTestingApp` from `test/utils/testing-app.ts`.
3. Do not import `describe`, `it`, `expect`, `beforeAll`, etc. from 'vitest', as they are globally available.

## Template for REST:
```typescript
import { E2EClient } from '../../test/utils/e2e-client';
import { createTestingApp } from '../../test/utils/testing-app';

describe('FeatureName (e2e)', () => {
  let client: E2EClient;

  beforeAll(async () => {
    const { fastify } = await createTestingApp();
    client = new E2EClient(fastify);
  });

  it('should process request and return 200', async () => {
    // Arrange
    // Act
    const response = await client.request({ method: 'GET', url: '/api/path' });
    // Assert
    expect(response.statusCode).toBe(200);
  });
});
```

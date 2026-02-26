import { describe, expect, it } from 'vitest';
import { createTestingApp } from './testing-app';

describe('createTestingApp (e2e harness)', () => {
  it('should init Nest app without listen', async () => {
    const { app } = await createTestingApp();

    expect(app.getHttpServer).toBeDefined();
  });
});

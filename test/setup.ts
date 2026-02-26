import { afterAll, beforeAll, beforeEach } from 'vitest';
import { clearDatabase, clearRedis } from './utils/clear-state';
import {
  closeTestingApp,
  createTestingApp,
  getPrisma,
  getRedis,
} from './utils/testing-app';

const shouldInitialize =
  process.env.VITEST_TARGET === 'e2e' || process.env.VITEST_TARGET === 'all';

if (shouldInitialize) {
  let initialized = false;

  beforeAll(async () => {
    await createTestingApp();
    initialized = true;
  });

  beforeEach(async () => {
    if (!initialized) {
      return;
    }

    await clearDatabase(getPrisma());
    await clearRedis(getRedis());
  });

  afterAll(async () => {
    if (!initialized) {
      return;
    }

    await closeTestingApp();
    initialized = false;
  });
}

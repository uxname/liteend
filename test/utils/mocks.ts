import type { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import type { Mocked, MockedObjectDeep } from '@vitest/spy';
import type { Job } from 'bullmq';
import type { PubSub } from 'mercurius';
import { vi } from 'vitest';
import type { PrismaClient } from '@/@generated/prisma/client';
import type { ProfileService } from '@/modules/profile/profile.service';

export function mock<T>(): Mocked<T> {
  const cache = new Map<string | symbol, unknown>();
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (typeof prop === 'symbol') return undefined;
        if (prop === 'then') return undefined; // prevent accidental thenable
        if (!cache.has(prop)) cache.set(prop, vi.fn());
        return cache.get(prop);
      },
      set(_, prop, value) {
        cache.set(prop, value);
        return true;
      },
    },
  ) as unknown as Mocked<T>;
}

// A callable vi.fn() proxy that also supports nested property access.
function deepFn(): ReturnType<typeof vi.fn> {
  const cache = new Map<string | symbol, unknown>();
  const fn = vi.fn();
  return new Proxy(fn, {
    get(target, prop) {
      if (typeof prop === 'symbol') return Reflect.get(target, prop);
      if (prop === 'then') return undefined; // prevent accidental thenable
      const native = Reflect.get(target, prop);
      if (native !== undefined) return native;
      if (!cache.has(prop)) cache.set(prop, deepFn());
      return cache.get(prop);
    },
    set(_, prop, value) {
      cache.set(prop, value);
      return true;
    },
  }) as ReturnType<typeof vi.fn>;
}

function mockDeep<T>(): MockedObjectDeep<T> {
  const cache = new Map<string | symbol, unknown>();
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (typeof prop === 'symbol') return undefined;
        if (prop === 'then') return undefined; // prevent accidental thenable
        if (!cache.has(prop)) cache.set(prop, deepFn());
        return cache.get(prop);
      },
      set(_, prop, value) {
        cache.set(prop, value);
        return true;
      },
    },
  ) as unknown as MockedObjectDeep<T>;
}

export const createJobMock = () => mockDeep<Job>();

export const createExecutionContextMock = () => mock<ExecutionContext>();

export const createArgumentsHostMock = () => mock<ArgumentsHost>();

export const createPrismaMock = () => mockDeep<PrismaClient>();
export const createProfileServiceMock = () => mockDeep<ProfileService>();
export const createPubSubMock = () => mock<PubSub>();

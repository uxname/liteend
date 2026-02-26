import type { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import type { Job } from 'bullmq';
import type { PubSub } from 'mercurius';
import { mock, mockDeep } from 'vitest-mock-extended';
import type { PrismaClient } from '@/@generated/prisma/client';
import type { ProfileService } from '@/modules/profile/profile.service';

export const createJobMock = () => mockDeep<Job>();

export const createExecutionContextMock = () => mock<ExecutionContext>();

export const createArgumentsHostMock = () => mock<ArgumentsHost>();

export const createPrismaMock = () => mockDeep<PrismaClient>();
export const createProfileServiceMock = () => mockDeep<ProfileService>();
export const createPubSubMock = () => mock<PubSub>();

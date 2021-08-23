import {PrismaClient} from '@prisma/client';
import {SecureJwtAccount} from './tools/AuthUtils';

export interface GraphQLContext {
    prisma: PrismaClient;
    account?: SecureJwtAccount | null;
}

import {PrismaClient} from '@prisma/client';
import {SecureJwtUser} from './tools/AuthUtils';

export interface GraphQLContext {
    prisma: PrismaClient;
    user?: SecureJwtUser;
}

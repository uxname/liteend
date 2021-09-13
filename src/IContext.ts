import {PrismaClient} from '@prisma/client';
import express from 'express';
import {AccountSession} from './generated/graphql_api';

export interface GraphQLContext {
    prisma: PrismaClient;
    request: express.Request;
    session?: AccountSession;
}

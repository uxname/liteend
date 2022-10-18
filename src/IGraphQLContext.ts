import {PrismaClient} from '@prisma/client';
import express from 'express';
import {AccountSession} from './generated/graphql-api';

export interface IGraphQLContext {
    prisma: PrismaClient;
    request: express.Request;
    session?: AccountSession;
}

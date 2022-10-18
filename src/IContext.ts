import {PrismaClient} from '@prisma/client';
import express from 'express';
import {AccountSession} from './generated/graphql-api';

export interface GraphQLContext {
    prisma: PrismaClient;
    request: express.Request;
    session?: AccountSession;
}

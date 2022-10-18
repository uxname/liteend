import {AccountSession} from '../../generated/graphql-api';
import GraphQLError from '../../modules/common/graphql-error';
import StatusCodes from '../../modules/common/status-codes';
import {prisma} from '../../modules/common/prisma.service';

export class AuthGuard {
    static assertIfNotAuthenticated(session?: AccountSession): void {
        if (!session?.account.id) {
            throw new GraphQLError({message: 'Forbidden', code: StatusCodes.FORBIDDEN});
        }
    }

    static async assertIfSessionsNotOwned(sessionId: number, otherSessionIds: number[]): Promise<void> {
        const session = await prisma.accountSession.findFirst({
            where: {
                id: sessionId
            },
            include: {
                account: true
            }
        });

        if (!session) {
            throw new GraphQLError({message: 'Session not found', code: StatusCodes.NOT_FOUND});
        }

        const otherSessions = await prisma.accountSession.findMany({
            where: {
                id: {
                    in: otherSessionIds
                }
            },
            include: {
                account: true
            }
        });

        for (const otherSession of otherSessions) {
            if (session.account.id !== otherSession.account.id) {
                throw new GraphQLError({message: 'Forbidden', code: StatusCodes.FORBIDDEN});
            }
        }
    }
}

import {AccountSession} from '../../generated/graphql_api';
import GraphQLError from '../../core/common/graphql-error';
import StatusCodes from '../../core/common/status-codes';

export class AuthGuard {
    static assertIfNotAuthenticated(session?: AccountSession): void {
        if (!session?.account.id) {
            throw new GraphQLError({message: 'Forbidden', code: StatusCodes.FORBIDDEN});
        }
    }
}

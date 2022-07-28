import StatusCodes from '../../modules/common/status-codes';
import GraphQLError from '../../modules/common/graphql-error';
import {AccountRole} from '../../generated/graphql_api';

export class RolesGuard {
    static assertIfNotInRoleArray(targetRoles: AccountRole[], allowedRoles: AccountRole[]) {
        if (!targetRoles.some(targetRole => allowedRoles.includes(targetRole))) {
            throw new GraphQLError({
                message: 'You are not allowed to perform this action',
                code: StatusCodes.FORBIDDEN,
                internalData: {targetRoles, allowedRoles}
            });
        }
    }
}


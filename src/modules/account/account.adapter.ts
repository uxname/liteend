import {Account as AccountDB} from '@prisma/client';
import {Account, AccountStatus} from '../../generated/graphql-api';

export class AccountAdapter {
    static dbToGraphQL(dbAccount: AccountDB): Account {
        return {
            ...dbAccount,
            roles: JSON.parse(dbAccount.rolesArrayJson),
            status: dbAccount.status as AccountStatus
        };
    }
}

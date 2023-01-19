import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@/graphql/graphql.module';
import { AccountRole } from '@/@generated/nestgraphql/prisma/account-role.enum';
import { AccountSessionService } from '@/graphql/account-session/account-session.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: AccountRole[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const account = gqlContext.getContext<GqlContext>().account;
    if (account) {
      return this.allowedRoles.every((role) => account.roles.includes(role));
    } else {
      throw new Error('You are not logged in');
    }
  }
}

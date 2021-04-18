import {Resolvers} from '../generated/graphql_api';
import {getLogger} from '../tools/Logger';
import {ApolloError} from 'apollo-server-express';
import StatusCodes from '../tools/StatusCodes';
import {AuthUtils} from '../tools/AuthUtils';
import config from '../config/config';

const log = getLogger('mutation');

const mutation: Resolvers = {
    Mutation: {
        echo: (parent, args, ctx, info) => {
            log.trace(ctx, info);
            return args.text;
        },
        register: async (parent, {username, password}, {prisma}) => {
            const valid = AuthUtils.validateUsernamePassword({username, password});
            if (valid) {
                throw new ApolloError(valid, String(StatusCodes.BAD_REQUEST));
            }

            try {
                const passwordHash = await AuthUtils.hash(password + config.server.salt);
                const account = await prisma.account.create({
                    data: {username: username.trim(), passwordHash}
                });
                const token = AuthUtils.createJwtToken(account);
                return {
                    account,
                    token
                };
            } catch (e) {
                log.warn(`Register "${username}" failed:`, e);
                throw new ApolloError('Register fail, user may be already exists', String(StatusCodes.CONFLICT));
            }
        }
    }
};

export default mutation;

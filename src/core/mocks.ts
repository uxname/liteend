/* eslint-disable no-magic-numbers,@typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';

export const mocks = {
    Mutation: {
        register: () => {
            return {
                token: `test_token_${_.random(999999).toString()}`,
                account: {
                    id: 4,
                    email: 'test@mail.com',
                    status: 'ACTIVE'
                }
            };
        }
    },
    Int: () => _.sample([1111, 2222, 3333, 4444, 1234, 1, 0, -123]),
    Float: () => _.sample([0.123, 1.111, 777.123, -123.456]),
    String: () => _.sample(['Hello world', 'lorem ipsum', 'Just a test string', 'test_str', 'test']),
    Date: () => _.sample([new Date(), new Date('2022-12-31T23:59:59.999Z'), new Date('2020-06-25T18:31:34.483Z'), new Date('1999-01-12T14:14:14.114Z')])
};


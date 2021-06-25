/* eslint-disable no-magic-numbers,@typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';

export const mocks = {
    Int: () => _.sample([1111, 2222, 3333, 4444, 1234, 1, 0, -123]),
    Float: () => _.sample([0.123, 1.111, 777.123, -123.456]),
    String: () => _.sample(['Hello world', 'lorem ipsum', 'Just a test string', 'test_str', 'test'])
};


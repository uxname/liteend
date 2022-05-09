// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    roots: ['<rootDir>/src'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    displayName: {
        name: packageJson.name,
        color: 'blue'
    }
};

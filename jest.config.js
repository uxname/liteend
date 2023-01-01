// eslint-disable-next-line @typescript-eslint/no-var-requires,unicorn/prefer-module
const packageJson = require('./package.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  roots: ['<rootDir>/src'],
  testTimeout: 30_000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  displayName: {
    name: packageJson.name,
    color: 'blue',
  },
};

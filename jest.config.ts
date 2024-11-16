import type { Config } from '@jest/types';

import packageJson from './package.json';

// Jest configuration object
const config: Config.InitialOptions = {
  // Specifies which files to collect coverage information from
  collectCoverageFrom: ['**/*.(t|j)s'],

  // Directory where coverage reports will be stored
  coverageDirectory: '../coverage',

  // Global timeout for tests
  testTimeout: 30_000,

  // Preset configuration for ts-jest
  preset: 'ts-jest',

  // Environment for running the tests
  testEnvironment: 'node',

  // Display name for Jest in test results
  displayName: {
    name: packageJson.name,
    color: 'blue',
  },

  // Maps module paths for cleaner imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Supported file extensions for modules
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Root directory for Jest
  rootDir: 'src',

  // Regular expression to find test files
  testRegex: String.raw`.*\.spec\.ts$`,

  // Transforms to apply to test files
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;

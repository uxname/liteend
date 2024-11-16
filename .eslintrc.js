module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'sonarjs',
    'unicorn',
    'comments',
    'jest',
    'promise',
    'security',
    'no-secrets',
    'simple-import-sort',
  ],
  extends: [
    '@jetbrains',
    '@jetbrains/eslint-config/node',
    'plugin:sonarjs/recommended-legacy',
    'plugin:security/recommended-legacy',
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    jest: true, // Enables Jest environment
  },
  ignorePatterns: ['.eslintrc.js', 'src/@generated/', 'src/common/telemetry.ts'],
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/interface-name-prefix': 'off', // No need for prefixes in interface names
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Reduces verbosity for boundary types
    '@typescript-eslint/no-shadow': 'error', // Prevents shadowing in TypeScript
    '@typescript-eslint/no-unused-vars': ['error'], // Flags unused variables
    '@typescript-eslint/no-explicit-any': 'error', // Avoids usage of `any`
    '@typescript-eslint/explicit-function-return-type': 'error', // Ensures explicit return types

    // General stylistic rules
    'quotes': ['error', 'single'], // Enforces single quotes
    'semi': ['error', 'always'], // Enforces semicolons
    'arrow-spacing': 'error', // Consistent spacing around arrow functions
    'prefer-template': 'error', // Encourages template literals over string concatenation
    'prefer-spread': 'error', // Promotes use of `spread` operator
    'prefer-arrow-callback': 'error', // Prefers arrow functions for callbacks
    'no-var': 'error', // Disallows `var` in favor of `let`/`const`
    'dot-notation': 'error', // Enforces dot notation when possible
    'comma-dangle': ['error', 'always-multiline'], // Consistent trailing commas for multiline objects
    'no-multiple-empty-lines': 'error', // Avoids multiple empty lines

    // Plugin-specific rules
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          e2e: true, // Allows specific abbreviation
        },
      },
    ],
    'simple-import-sort/imports': 'error', // Enforces sorted imports
    'simple-import-sort/exports': 'error', // Enforces sorted exports
    'jest/no-disabled-tests': 'warn', // Warns about disabled tests
    'jest/no-focused-tests': 'error', // Errors on focused tests
    'jest/no-identical-title': 'error', // Prevents duplicate test titles
    'jest/prefer-to-have-length': 'warn', // Promotes `.toHaveLength` for array length checks
    'jest/valid-expect': 'error', // Ensures valid `expect` statements
    'jest/consistent-test-it': ['error', { fn: 'test' }], // Enforces consistent use of `test`

    // Disabled rules for specific cases
    'no-shadow': 'off', // Replaced by TypeScript equivalent
    'new-cap': 'off', // Disabling constructor capitalization rule
    'object-curly-spacing': 'off', // Handled by Prettier
    'no-unused-vars': 'off', // Replaced by TypeScript equivalent
    'no-use-before-define': 'off', // Too restrictive for TypeScript
    'eslint-comments/disable-enable-pair': 'off', // Allows single `disable` comments
    'sonarjs/todo-tag': 'off', // Allows `TODO` tags for development

    // Additional rules
    'no-magic-numbers': 'warn', // Avoids unexplained numeric literals
  },
};

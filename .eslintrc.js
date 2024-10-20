module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
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
    // node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'src/@generated/', 'src/common/telemetry.ts'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          e2e: true,
        },
      },
    ],
    'no-magic-numbers': 'warn',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-multiple-empty-lines': 'error',
    'prefer-template': 'error',
    'prefer-spread': 'error',
    'prefer-arrow-callback': 'error',
    'no-var': 'error',
    'object-curly-spacing': 'off',
    'arrow-spacing': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest/consistent-test-it': ['error', { fn: 'test' }],
    'new-cap': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'dot-notation': 'error',
    'no-use-before-define': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    "@typescript-eslint/explicit-function-return-type": "error",
    "eslint-comments/disable-enable-pair": "off",
    "sonarjs/todo-tag": "off"
  },
};

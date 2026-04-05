import swc from 'unplugin-swc';
import { configDefaults, defineConfig } from 'vitest/config';

const vitestTarget = process.env.VITEST_TARGET ?? 'unit';

const unitIncludes = ['src/**/*.spec.ts', 'test/utils/**/*.spec.ts'];
const e2eIncludes = ['test/**/*.spec.ts'];

const isE2ETarget = vitestTarget === 'e2e' || vitestTarget === 'all';

const includePatterns = (() => {
  if (vitestTarget === 'e2e') {
    return e2eIncludes;
  }

  if (vitestTarget === 'all') {
    return Array.from(new Set([...unitIncludes, ...e2eIncludes]));
  }

  return unitIncludes;
})();

const excludePatterns =
  vitestTarget === 'unit'
    ? [...configDefaults.exclude, 'test/utils/**/*.e2e.spec.ts']
    : configDefaults.exclude;

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
    include: includePatterns,
    exclude: excludePatterns,
    setupFiles: ['test/setup.ts'],
    maxConcurrency: isE2ETarget ? 1 : configDefaults.maxConcurrency,
    fileParallelism: !isE2ETarget,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/@generated/**',
        'src/main.ts',
        'src/bootstrap/**',
        '**/*.module.ts',
        'src/db-backup-tool/**',
        'src/i18n/**',
        '**/*.spec.ts',
        'test/**',
        'src/**/mocks.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  oxc: false,
  plugins: [
    swc.vite({
      module: { type: 'nodenext' },
    }),
  ],
});

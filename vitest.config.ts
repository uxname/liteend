import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    tsconfigPaths(),
    // The SWC plugin is needed for the correct operation of NestJS decorators.
    swc.vite({
      module: { type: 'nodenext' },
    }),
  ],
});

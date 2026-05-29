import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

import viteConfigFn from './vite.config';

const viteConfig = viteConfigFn({ command: 'serve', isPreview: false, isSsrBuild: false, mode: 'test' });

const resolvedViteConfig =
  typeof viteConfig === 'function' ? viteConfig({ command: 'serve', mode: 'test' }) : viteConfig;

export default mergeConfig(
  resolvedViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
);

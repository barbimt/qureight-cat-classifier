import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      fileParallelism: false,
      env: {
        VITE_CLASSIFIER_DELAY_MS: '0',
      },
    },
  }),
);

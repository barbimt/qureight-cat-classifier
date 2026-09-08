import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { mockClassifierApiPlugin } from './src/mocks/devServerPlugin.ts';

export default defineConfig({
  plugins: [react(), tailwindcss(), mockClassifierApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});

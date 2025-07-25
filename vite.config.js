import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true, // auto opens browser on dev server start
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});
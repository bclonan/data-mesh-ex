import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  test: {
    globals: true,
    environment: 'node',
  },
  server: {
    port: 3000,
    open: true
  }
});
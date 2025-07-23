import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    // Removed include and exclude to use Vitest defaults
    hookTimeout: 10000,
    onConsoleLog(log, type) {
      if (type === 'error') {
        // Print all error logs to help diagnose silent failures
        console.error('Vitest error:', log);
      }
    },
  },
});

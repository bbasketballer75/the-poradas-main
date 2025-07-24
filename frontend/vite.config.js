import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      react(),
      // Bundle analyzer (only in analyze mode)
      mode === 'analyze' && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean),
    
    build: {
      // Enable code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for large libraries
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // Map libraries
            maps: ['leaflet', 'react-leaflet'],
            // Utils and smaller dependencies
            utils: ['axios']
          }
        }
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Enable source maps for better debugging
      sourcemap: command === 'serve'
    },
    
    server: {
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: 'http://localhost:5000', // Your backend server address
          changeOrigin: true,
        },
        // Proxy static asset requests like uploaded images
        '/uploads': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },
    
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      // you might want to disable it, if you don't have tests that rely on CSS
      // since parsing CSS is slow
      css: true,
    },
  };
});

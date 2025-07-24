// SSR/SSG prerender configuration for Vite
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Static site generation
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        // Add more entry points for different pages if needed
      }
    }
  },
  
  // SSR configuration
  ssr: {
    // Define which dependencies should be externalized for SSR
    external: ['react', 'react-dom'],
    // Ensure proper handling of Node.js modules
    noExternal: ['axios', 'leaflet', 'react-leaflet']
  }
});

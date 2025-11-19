import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Enable React integration
  integrations: [react()],
  // Enable static site generation (default mode)
  output: 'static',

  // Site configuration for GitHub Pages
  site: 'https://vanmarkic.github.io',
  base: '/how-not-to-diet',

  // Build configuration
  build: {
    inlineStylesheets: 'auto',
  },

  // Vite configuration for path aliases
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@utils': '/src/utils',
        '@data': '/data',
        '@types': '/src/types',
      },
    },
  },

  // Server configuration for development
  server: {
    port: 3000,
    host: true,
  },
});

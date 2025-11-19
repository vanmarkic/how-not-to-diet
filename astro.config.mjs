import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Enable React integration and sitemap generation
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  // Enable static site generation (default mode)
  output: 'static',

  // Site configuration for GitHub Pages
  site: 'https://vanmarkic.github.io/how-not-to-diet/',
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

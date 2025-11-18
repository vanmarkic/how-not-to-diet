import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Enable static site generation (default mode)
  output: 'static',

  // Site configuration for GitHub Pages
  // Update 'username' and 'repo-name' with your actual GitHub username and repository name
  site: 'https://username.github.io',
  base: '/repo-name'

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

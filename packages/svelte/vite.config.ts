/// <reference types='vitest' />
import { defineConfig } from 'vite';
// import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/svelte',
  server:{
    port: 7200,
    host: 'localhost',
  },
  preview:{
    port: 7300,
    host: 'localhost',
  },
  plugins: [
    //... other plugins
    // svelte(), // Add this line
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));

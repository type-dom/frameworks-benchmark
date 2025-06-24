/// <reference types='vitest' />
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/solidjs',
  server:{
    port: 6200,
    host: 'localhost',
  },
  preview:{
    port: 6300,
    host: 'localhost',
  },
  plugins: [
    // viteTsConfigPaths({
    //   root: '../../',
    // }),
    solid()
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

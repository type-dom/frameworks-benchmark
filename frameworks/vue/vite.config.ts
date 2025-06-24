import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/vue',
  server:{
    port: 9200,
    host: 'localhost',
  },
  preview:{
    port: 9300,
    host: 'localhost',
  },
  plugins: [vue(), ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    'emptyOutDir': true,
    'transformMixedEsModules': true,
    'outDir': "./dist",
    'reportCompressedSize': true,
    'commonjsOptions': {"transformMixedEsModules":true},
  },
}));

import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import SSR from 'vite-ssr/plugin';

export default defineConfig({
   build: {
      target: 'es2015',
      outDir: './dist'
   },
   plugins: [Vue(), SSR()]
});

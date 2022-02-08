import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import SSR from 'vite-ssr/plugin'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: './dist'
  },
  resolve: {
    alias: {
      '/@/': './src/'
    }
  },
  css: {
    preprocessorOptions: {
      scss: { 
        additionalData: `@import "./src/styles/shared";`
      }
    }
  },
  plugins: [
    Vue(),
    Pages(),
    SSR(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'icon'
        })
      ]
    }),
    Icons({
      compiler: 'vue3'
    })
  ]
})

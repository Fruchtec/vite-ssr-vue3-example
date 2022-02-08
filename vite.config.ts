import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import SSR from 'vite-ssr/plugin'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: './dist'
  },
  plugins: [
    Vue(),
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

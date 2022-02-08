import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import SSR from 'vite-ssr/plugin'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import path from 'path'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: './dist'
  },
  alias: {
    '/@/': `${path.resolve(__dirname, 'src')}/`
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

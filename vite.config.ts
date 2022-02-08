import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import SSR from 'vite-ssr/plugin'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: './dist'
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.mjs'],
    alias: {
      '/@/': './src/'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "./src/styles/variables/element-overrides.scss" as *;
        `
      }
    }
  },
  plugins: [
    Vue(),
    Pages(),
    SSR(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          ssr: false,
          importStyle: 'sass'
        }),
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

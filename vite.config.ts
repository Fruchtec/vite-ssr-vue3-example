import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import SSR from 'vite-ssr/plugin'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components  from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
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
        additionalData: `
         // @use "./src/styles/variables/element-overrides.scss" as *;
        // @use "node_modules/element-plus/theme-chalk/src/mixins/var.scss" as *;
        @use "./src/styles/shared.scss" as *;
        `
      }
    }
  },
  plugins: [
    Vue(),
    Pages(),
    SSR(),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    Components({
      resolvers: [
        ElementPlusResolver({
          ssr: true,
          importStyle: 'sass'
        }),
        IconsResolver({
          prefix: 'icon'
        }),
      ]
    }),
    Icons({
      compiler: 'vue3'
    })
  ]
})

import { createHead } from '@vueuse/head'
import { viteSSR } from 'vite-ssr/vue'
import routes from '~pages'
import App from './App.vue'
import store from './stores'
import './styles/main.scss'
// import './styles/variables/element-overrides.scss'

const Options: Parameters<typeof viteSSR>['1'] = {
  routes,
  pageProps: {
    passToPage: false
  }
}

export default viteSSR(App, Options, async params => {
  const {
    app,
    initialState,
    isClient
  } = params
  const head = createHead()

  app.use(head)
  app.use(store)

  return {
    head
  }
})

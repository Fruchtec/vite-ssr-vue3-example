import { createHead } from '@vueuse/head';
import { viteSSR } from 'vite-ssr/vue';
import { routes } from '/src/router/router';
import App from '/src/App.vue';
import store from './stores'

const Options: Parameters<typeof viteSSR>['1'] = {
   routes,
   pageProps: {
      passToPage: false
   },
};

export default viteSSR(App, Options, async (params) => {
   const { app, initialState, isClient, router } = params;
   const head = createHead();

   app.use(head)
    app.use(router)
   app.use(store)

   return {
      head
   };
});

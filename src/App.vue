<template>
  <div id="navbar">
    <RouterLink class="link" :to="{ name: 'Index' }">
      Home
    </RouterLink>
    <RouterLink class="link" :to="{ name: 'Products' }">
      Products
    </RouterLink>
  </div>

  <div id="app-body">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </RouterView>
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '@vueuse/head'

useHead({
  meta: [{ name: 'og:site_name', content: 'Vite SSR Example Project' }]
})
</script>

<style lang="scss">
@import "styles/main";
</style>

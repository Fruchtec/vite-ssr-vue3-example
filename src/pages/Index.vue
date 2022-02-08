<template>
  <div class="text-center">
    Vite SSR Example Project
  </div>
  <div><icon-mdi-account /> Count: {{ demoStore.count }}</div>
  <el-button type="primary" @click="increment">Increment</el-button>
</template>

<script lang="ts" setup>
import { computed } from '@vue/runtime-dom'
import { useHead } from '@vueuse/head'
import { useStore } from 'vuex'

useHead({
  title: 'Home'
})

const store = useStore()
const demoStore = computed(() => store.state.demo)

function increment() {
  store.dispatch('increment')
}
</script>

<style lang="scss" scoped>
.text-center {
  color: $color-primary-custom;
  font-size: 32px;
}
</style>

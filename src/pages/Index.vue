<template>
  <div class="text-center">
    Vite SSR Example Project
  </div>
  <div><icon-mdi-account /> Coins: {{ user.coins }}</div>
  <button @click="increment">
     Increment
  </button>
</template>

<script lang="ts" setup>
import { useHead } from '@vueuse/head'
import { computed } from '@vue/runtime-dom'
import { useStore } from 'vuex'

useHead({
  title: 'Home'
})

const store = useStore()

const user = computed(() => store.state.user)
console.log(user.value)

function increment() {
  store.dispatch('increment')
}

console.log(user.value)

</script>

<style lang="scss">
$color: red;

.text-center {
  color: $color;
  font-size: 16px;
}
</style>

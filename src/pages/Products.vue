<template>
  <div>Count: {{ demoStore.count }}</div>
  <button @click="increment">
    Increment
  </button>

  <div class="flex flex-row flex-wrap px-10 justify-center">
    <template v-if="productData">
      <Card
        v-for="product in productData"
        :key="product.id"
        :product="product"
      />
    </template>
    <h3 v-else>
      Loading...
    </h3>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/runtime-dom'
import { useHead } from '@vueuse/head'
import { useStore } from 'vuex'
import { useAsyncData } from '../helpers/useAsyncData'

useHead({
  title: 'Products'
})

const store = useStore()
const demoStore = computed(() => store.state.demo)

function increment() {
  store.dispatch('increment')
}

interface Product {
   id: number;
   title: string;
   price: number;
   description: string;
   category: string;
   image: string;
}

const productData = await useAsyncData<Product[]>(
  'productsData',
  'https://fakestoreapi.com/products/',
  {
    axiosConfig: {},
    awaitSetup: false
  }
)
</script>

<style lang="scss" scoped>
div {
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
  background-color: gray;
}
</style>

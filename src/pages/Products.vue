<script lang="ts" setup>
import Card from '/src/components/Card.vue'
import { useHead } from '@vueuse/head'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-dom'
import { useAsyncData } from '../helpers/useAsyncData'

useHead({
  title: 'Products'
})

const store = useStore()

const user = computed(() => store.state.user)
console.log(user.value)

function increment() {
  store.dispatch('increment')
}

console.log(user.value)

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

<template>
  <div>Coins: {{ user.coins }}</div>
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

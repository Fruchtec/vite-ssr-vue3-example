<script lang="ts" setup>
interface Product {
   id: number;
   title: string;
   price: number;
   description: string;
   category: string;
   image: string;
}
interface Props {
   product: Product;
}

defineProps<Props>()
</script>

<template>
  <RouterLink :to="{ name: 'Product', params: { id: product.id } }" class="card">
    <div class="card-img">
      <img
        loading="lazy"
        :src="product.image"
        alt="image of card"
      >
    </div>
    <div class="card-body">
      <h4 class="card-title text-center">
        {{ product.title }}
      </h4>
      <small class="card-detail">{{ product.description }}</small>
      <div class="card-price">
        {{ product.price }}$
      </div>
    </div>
  </RouterLink>
</template>

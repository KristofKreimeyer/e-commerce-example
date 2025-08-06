<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>Image Container</div>
    <div>Description Container</div>
  </div>

  <div v-if="product">
    <h1>{{ product.title }}</h1>
    <p>{{ product.description }}</p>
    <p>Price: {{ product.price }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { computed } from 'vue'

const route = useRoute()
const productStore = useProductStore()
const productId = computed(() => Number(route.params.id))

const product = computed(() => productStore.products.find((p) => p.id === productId.value))
</script>

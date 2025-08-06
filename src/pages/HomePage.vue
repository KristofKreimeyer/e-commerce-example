<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Alle Produkte</h1>

    <div v-if="loading" class="text-gray-500">Produkte werden geladen...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'
import ProductCard from '@/components/ProductCard.vue'

const productStore = useProductStore()
const { products, loading, error } = storeToRefs(productStore)

onMounted(() => {
  if (!products.value.length) {
    productStore.fetchProducts()
  }
})
</script>

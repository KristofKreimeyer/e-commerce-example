<template>
  <div class="border rounded-xl shadow-md p-4 bg-white">
    <img :src="product.image" :alt="product.description" class="w-full h-48 object-contain mb-4" />
    <h2 class="text-lg font-semibold">{{ product.name }}</h2>
    <p class="text-gray-600 line-clamp-3">{{ product.description }}</p>
    <p class="text-xl font-bold mt-2">{{ product.price.toFixed(2) }} €</p>
    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      In den Warenkorb
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/stores/productStore'

defineProps<{ product: Product }>()
</script>

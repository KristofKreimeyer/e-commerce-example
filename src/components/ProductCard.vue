<template>
  <router-link :to="`/product/${product.id}`">
    <div class="border rounded-xl shadow-md p-4 bg-white">
      <img
        :src="product.image"
        :alt="product.description"
        class="w-full h-48 object-contain mb-4"
      />
      <h2 class="text-lg font-semibold">{{ product.title }}</h2>
      <p class="text-gray-600 line-clamp-3">{{ product.description }}</p>
      <p class="text-xl font-bold mt-2">{{ product.price.toFixed(2) }} €</p>
      <button
        @click="
          cart.addToCart({
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: 1,
            image: product.image,
          })
        "
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
      >
        In den Warenkorb
      </button>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Product } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()

defineProps<{ product: Product }>()
</script>

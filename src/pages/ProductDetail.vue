<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <ProductGallery v-if="product?.images?.length" :images="product.images" />
    </div>
    <div>
      <p class="text-lg font-semibold rounded border inline-block p-1">{{ product?.category }}</p>
      <h2 class="text-4xl font-bold mb-2 my-8">{{ product?.title }}</h2>
      <!-- Rating Begin-->
      <div class="flex items-center mb-4">
        <div class="flex items-center gap-1 text-yellow-500 text-lg mr-4">
          <span v-for="n in fullStars" :key="'full-' + n">★</span>
          <span v-if="hasHalfStar">☆</span>
          <span v-for="n in emptyStars" :key="'empty-' + n" class="opacity-30">★</span>
        </div>
        <p class="text-sm mr-8">[{{ product?.rating?.rate }} / 5 ]</p>
        <p class="text-sm">{{ product?.rating?.count }} Bewertungen</p>
      </div>
      <!-- Rating End -->

      <p class="text-2xl font-semibold my-8">{{ product?.price.toFixed(2) }} €</p>
      <ButtonComponent
        type="button"
        size="lg"
        variant="primary"
        class="apple-button text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg cursor-pointer w-full block text-center"
        @click="product && addToCart(product)"
      >
        In den Warenkorb
      </ButtonComponent>

      <p>Description:</p>
      <ul class="list-disc list-inside my-4">
        <li v-for="(item, index) in descriptionItems" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductStore, type Product } from '@/stores/productStore'
import { computed, onMounted } from 'vue'
import ProductGallery from '@/components/product/ProductGallery.vue'

const route = useRoute()
const productStore = useProductStore()
const productId = computed(() => Number(route.params.id))

const product = computed(() => productStore.products.find((p) => p.id === productId.value))

const descriptionItems = computed(() =>
  product.value?.description
    ?.split(/[.,;]/) // trennt bei Punkt, Komma oder Semikolon
    .map((item) => item.trim())
    .filter((item) => item.length > 0),
)

// Rating calculations
const fullStars = computed(() => Math.floor(product.value?.rating?.rate || 0))
const hasHalfStar = computed(() => {
  const rate = product.value?.rating?.rate || 0
  return rate - Math.floor(rate) >= 0.5
})
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0))

onMounted(() => {
  if (!product.value) {
    productStore.fetchProducts()
  }
})

import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()

const addToCart = (product: Product) => {
  cart.addToCart({
    id: product.id,
    name: product.title,
    price: product.price,
    quantity: 1,
    image: product.image,
  })
}
</script>

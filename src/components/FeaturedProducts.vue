<template>
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-light apple-text mb-4 tracking-tight">
          Beliebte Produkte
        </h2>
        <p class="text-xl apple-secondary">Ausgewählte Highlights unserer Kollektion</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="product in featuredProducts" :key="product.id" class="group cursor-pointer">
          <ProductCard :product="product" @add-to-cart="addToCart(product)" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useProductStore, type Product } from '@/stores/productStore'
import { computed, onMounted } from 'vue'
import ProductCard from './product/ProductTile.vue'

const cartStore = useCartStore()
const productStore = useProductStore()

// Dummy wishlist for demonstration; replace with your actual wishlist logic/store

// Produkt in den Warenkorb
function addToCart(product: Product) {
  cartStore.addToCart({
    id: product.id,
    name: product.title, // assuming 'title' is the product name
    price: product.price,
    quantity: 1,
    image: product.image,
  })
}

// Die Top 4 Produkte (z. B. basierend auf Rating)
const featuredProducts = computed(() => {
  return [...productStore.products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4)
})

onMounted(() => {
  if (!featuredProducts.value.length) {
    productStore.fetchProducts()
  }
})
</script>

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
          <div
            class="apple-card apple-shadow rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 ease-out"
          >
            <div class="relative p-8 bg-white">
              <img
                :src="product.image"
                :alt="product.title"
                class="w-full h-48 object-contain mb-6"
              />
              <button
                class="absolute top-4 right-4 w-10 h-10 bg-white/80 apple-blur rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
              >
                <Heart
                  :class="[
                    'w-5 h-5 transition-colors',
                    wishlist.includes(product.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-600 hover:text-red-500',
                  ]"
                />
              </button>
            </div>

            <div class="p-6 pt-0">
              <p class="text-xs apple-secondary font-medium uppercase tracking-wider mb-2">
                {{ product.category }}
              </p>
              <h3 class="font-medium apple-text mb-3 line-clamp-2 h-12 text-sm leading-5">
                {{ product.title }}
              </h3>

              <div class="flex items-center mb-4">
                <div class="flex mr-2">
                  <Star
                    v-for="star in 5"
                    :key="star"
                    :class="[
                      'w-3 h-3',
                      star <= Math.floor(product.rating.rate)
                        ? 'text-blue-500 fill-blue-500'
                        : star === Math.ceil(product.rating.rate) && product.rating.rate % 1 !== 0
                          ? 'text-blue-300 fill-blue-300'
                          : 'text-gray-300',
                    ]"
                  />
                </div>
                <span class="text-xs apple-secondary"> ({{ product.rating.count }}) </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xl font-semibold apple-text"> €{{ product.price }} </span>
                <ButtonComponent
                  type="button"
                  size="md"
                  :disabled="false"
                  @click.stop="addToCart(product)"
                  variant="outline"
                >
                  <Plus class="w-4 h-4" />
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useProductStore, type Product } from '@/stores/productStore'
import { computed, onMounted, ref } from 'vue'
import { Heart, Plus, Star } from 'lucide-vue-next'
import ButtonComponent from './ButtonComponent.vue'

const cartStore = useCartStore()
const productStore = useProductStore()

// Dummy wishlist for demonstration; replace with your actual wishlist logic/store
const wishlist = ref<number[]>([])

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

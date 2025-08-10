<template>
  <router-link :to="`/product/${product.id}`">
    <div
      class="apple-card apple-shadow rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 ease-out"
    >
      <div class="relative p-8 bg-white">
        <img :src="product.image" :alt="product.title" class="w-full h-48 object-contain mb-6" />
        <ButtonComponent
          type="button"
          size="sm"
          variant="icon"
          class="absolute top-4 right-4 transition-all duration-500 cursor-pointer"
        >
          <Heart
            :class="[
              'w-5 h-5 transition-colors',
              wishlist.includes(product.id)
                ? 'text-red-700 fill-red-700'
                : 'text-gray-700 hover:text-red-700',
            ]"
          />
        </ButtonComponent>
        <span class="sr-only">Zum Wunschzettel hinzufügen</span>
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
            class="cursor-pointer"
          >
            <Plus class="w-4 h-4" />
          </ButtonComponent>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/stores/productStore'
import { ref } from 'vue'

defineProps<{ product: Product }>()

// Dummy wishlist for demonstration; replace with your actual wishlist logic/store
const wishlist = ref<number[]>([])

const cartStore = useCartStore()

function addToCart(product: Product) {
  cartStore.addToCart({
    id: product.id,
    name: product.title, // assuming 'title' is the product name
    price: product.price,
    quantity: 1,
    image: product.image,
  })
}
</script>

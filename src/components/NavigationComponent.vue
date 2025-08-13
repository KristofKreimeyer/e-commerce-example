<template>
  <nav class="apple-blur bg-white/70 shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <div class="text-2xl font-semibold apple-text">
            <RouterLink
              to="/"
              aria-label="ShopHub Startseite"
              class="inline-flex items-center select-none overflow-hidden leading-none transition-all duration-200 hover:shadow-sm hover:-translate-y-[1px]"
            >
              <span
                class="text-black font-semibold tracking-tight pl-3 pr-1 py-1.5 text-[1.15rem] md:text-[1.25rem]"
              >
                Shop
              </span>

              <span
                class="bg-[#f90] text-black rounded-sm font-semibold tracking-tight px-3 py-1.5 text-[1.15rem] md:text-[1.25rem]"
              >
                hub
              </span>
              <span class="sr-only">ShopHub Logo</span>
            </RouterLink>
          </div>
        </div>

        <div class="hidden md:flex items-center space-x-10 text-sm font-medium">
          <router-link
            to="/catalog"
            class="apple-text hover:text-blue-600 transition-colors duration-300"
          >
            Katalog
          </router-link>
        </div>

        <!-- Wishlist -->
        <div class="flex items-center space-x-3">
          <router-link
            to="/wishlist"
            class="relative p-2.5 text-gray-600 hover:text-blue-600 rounded-full transition-all duration-300"
          >
            <ButtonComponent
              type="button"
              size="md"
              variant="icon"
              class="p-2.5 text-gray-700 hover:text-blue-700 rounded-full transition-all duration-300"
            >
              <Heart class="h-5 w-5" />
              <span class="sr-only">Wunschliste</span>
            </ButtonComponent>
          </router-link>

          <!-- Login -->
          <router-link
            to="/account"
            class="relative p-2.5 text-gray-600 hover:text-blue-600 rounded-full transition-all duration-300"
          >
            <ButtonComponent
              type="button"
              size="md"
              variant="icon"
              class="p-2.5 text-gray-600 hover:text-blue-600 rounded-full transition-all duration-300"
            >
              <User class="h-5 w-5" />
              <span class="sr-only">Login</span>
            </ButtonComponent>
          </router-link>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative p-2.5 text-gray-600 hover:text-blue-600 rounded-full transition-all duration-300"
          >
            <ShoppingBag class="h-5 w-5" />
            <span class="sr-only">Warenkorb</span>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            >
              {{ cartCount }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { computed } from 'vue'

// Stores
const cartStore = useCartStore()

// Computed property for cart item count
const cartCount = computed(() => {
  return cartStore.items.length
})

import { ShoppingBag, Heart, User } from 'lucide-vue-next'
import ButtonComponent from './ButtonComponent.vue'
</script>

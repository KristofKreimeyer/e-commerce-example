<template>
  <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
    <!-- Product Image -->
    <div class="relative group">
      <div
        class="w-32 h-32 rounded-2xl overflow-hidden apple-shadow bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <img
          :src="item.image"
          :alt="item.name"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <!-- Wunschliste -->
      <ButtonComponent
        type="button"
        size="sm"
        variant="icon"
        class="absolute top-4 right-4 transition-all duration-500 cursor-pointer"
        :aria-pressed="inWishlist ? 'true' : 'false'"
        aria-label="Zur Wunschliste hinzufügen oder entfernen"
        @click="$emit('toggle-wishlist', item.id)"
      >
        <Heart
          :class="[
            'w-5 h-5 transition-colors',
            inWishlist ? 'text-red-700 fill-red-700' : 'text-gray-700 hover:text-red-700',
          ]"
        />
      </ButtonComponent>
    </div>

    <!-- Details & Quantity -->
    <div class="flex-1">
      <h2 class="text-3xl font-bold text-gray-900 mb-2 font-sf">
        {{ item.name }}
      </h2>

      <p class="text-2xl font-semibold text-blue-600 mb-4">
        {{ formatEUR(item.price * item.quantity) }}
      </p>

      <!-- Quantity Controls -->
      <div class="flex items-center space-x-4">
        <span class="text-lg text-gray-600 font-medium font-sf">Anzahl:</span>

        <div class="flex items-center space-x-3">
          <ButtonComponent
            @click="$emit('decrease', item.id)"
            variant="icon"
            class="w-12 h-12"
            aria-label="Menge verringern"
          >
            <Minus class="w-5 h-5 text-gray-700" />
          </ButtonComponent>

          <span
            class="text-2xl font-semibold text-gray-900 min-w-[3rem] text-center font-sf"
            aria-live="polite"
          >
            {{ item.quantity }}
          </span>

          <ButtonComponent
            type="button"
            @click="$emit('increase', item.id)"
            variant="icon"
            class="w-12 h-12 rounded-2xl flex items-center justify-center hover:shadow-lg"
            aria-label="Menge erhöhen"
          >
            <Plus class="w-5 h-5 text-gray-700" />
          </ButtonComponent>
        </div>
      </div>
    </div>

    <!-- Remove -->
    <ButtonComponent
      type="button"
      @click="$emit('remove', item.id)"
      variant="outline"
      class="group flex items-center space-x-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-[#db000a] hover:text-red-700 rounded-2xl hover:shadow-lg"
      aria-label="Artikel aus dem Warenkorb entfernen"
    >
      <Trash class="w-5 h-5" />
      <span class="font-medium font-sf">Entfernen</span>
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue'
import { Heart, Minus, Plus, Trash } from 'lucide-vue-next'

type CartItem = {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

defineProps<{
  item: CartItem
  inWishlist: boolean
}>()

defineEmits<{
  (e: 'increase', id: number): void
  (e: 'decrease', id: number): void
  (e: 'remove', id: number): void
  (e: 'toggle-wishlist', id: number): void
}>()

const formatEUR = (v: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v)
</script>

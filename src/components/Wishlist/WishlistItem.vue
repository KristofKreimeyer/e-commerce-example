<template>
  <article class="apple-card apple-shadow rounded-3xl overflow-hidden">
    <RouterLink :to="`/product/${product.id}`" custom v-slot="{ href, navigate }">
      <a :href="href" @click="navigate" class="block p-6 bg-white">
        <img :src="product.image" :alt="product.title" class="w-full h-40 object-contain mb-4" />
        <h3 class="apple-text text-sm font-medium line-clamp-2 h-10">{{ product.title }}</h3>
        <p class="text-xs apple-secondary mt-1">{{ product.category }}</p>
        <p class="apple-text font-semibold mt-2">€{{ product.price }}</p>
      </a>
    </RouterLink>

    <div class="flex items-center gap-2 p-4 pt-0">
      <button
        type="button"
        class="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
        @click="$emit('add-to-cart')"
      >
        In den Warenkorb
      </button>
      <button
        type="button"
        class="ml-auto rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
        @click="$emit('remove')"
        aria-label="Aus Wunschzettel entfernen"
      >
        Entfernen
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '@/stores/productStore'
defineProps<{ product: Product }>()
defineEmits<{ (e: 'remove'): void; (e: 'add-to-cart'): void }>()
</script>

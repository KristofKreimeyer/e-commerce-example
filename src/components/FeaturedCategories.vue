<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-light apple-text mb-4 tracking-tight">Kategorien</h2>
        <p class="text-xl apple-secondary">Finde genau das, was du suchst</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="category in uniqueCategories" :key="category" class="group cursor-pointer">
          <div
            class="apple-card apple-shadow rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 ease-out"
          >
            <div class="relative h-48">
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white text-lg font-medium capitalize">
                  {{ category }}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
const productStore = useProductStore()

const uniqueCategories = computed(() => {
  return [...new Set(productStore.products.map((product) => product.category))]
})
</script>

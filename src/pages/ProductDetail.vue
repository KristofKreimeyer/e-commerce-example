<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <ProductGallery v-if="product?.images?.length" :images="product.images" />
    </div>
    <div>Description Container</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { computed } from 'vue'
import ProductGallery from '@/components/ProductGallery.vue'

const route = useRoute()
const productStore = useProductStore()
const productId = computed(() => Number(route.params.id))

const product = computed(() => productStore.products.find((p) => p.id === productId.value))
</script>

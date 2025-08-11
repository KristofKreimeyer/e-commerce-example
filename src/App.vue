<template>
  <div class="min-h-screen w-full flex flex-col text-gray-900">
    <!-- Globaler Header mit Navigationslink -->
    <!-- <Header /> -->
    <AppHeader />

    <!-- Seiteninhalt je nach Route -->
    <main class="w-full container mx-auto px-4 py-6">
      <RouterView />
      <!-- Toast-Nachrichten -->
      <ToastMessage />
    </main>

    <!-- Globaler Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/layout/AppHeader.vue'
import AppFooter from '@/layout/AppFooter.vue'
import ToastMessage from './components/ToastMessage.vue'
import { useCartStore } from './stores/cartStore'
import { onMounted } from 'vue'

const cart = useCartStore()
onMounted(() => {
  cart.init()
})
</script>

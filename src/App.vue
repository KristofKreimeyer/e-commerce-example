<template>
  <div class="min-h-screen w-full bg-amber-800 flex flex-col text-gray-900">
    <!-- Globaler Header mit Navigationslink -->
    <!-- <Header /> -->
    <AppHeader />

    <!-- Seiteninhalt je nach Route -->
    <main class="w-full container mx-auto px-4 py-6">
      <RouterView />
    </main>

    <!-- Globaler Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/layout/AppHeader.vue'
import AppFooter from '@/layout/AppFooter.vue'
</script>

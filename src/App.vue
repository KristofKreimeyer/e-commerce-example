<template>
  <div class="min-h-screen w-full bg-amber-800 flex flex-col text-gray-900">
    <!-- Globaler Header mit Navigationslink -->
    <!-- <Header /> -->

    <!-- Seiteninhalt je nach Route -->
    <main class="w-full container mx-auto px-4 py-6">
      <RouterView />
    </main>

    <!-- Optional: Footer -->
    <footer class="text-center py-4 text-sm text-gray-500">
      © {{ new Date().getFullYear() }} – Dein Shop
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

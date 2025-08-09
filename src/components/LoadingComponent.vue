<template>
  <!-- Loading State -->
  <div v-if="loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto"
      ></div>
      <p class="mt-6 apple-secondary text-sm">Produkte werden geladen</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)

// Simulate loading
setTimeout(() => {
  loading.value = false
}, 2000)
</script>

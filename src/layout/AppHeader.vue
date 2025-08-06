<template>
  <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <router-link to="/" class="text-white no-underline">
      <h1 class="text-2xl font-bold">Mein Shop</h1>
    </router-link>
    <nav class="mt-2">
      <ul class="flex space-x-4">
        <li><router-link to="/" class="hover:underline">Startseite</router-link></li>
        <li><router-link to="/products" class="hover:underline">Produkte</router-link></li>
        <li><router-link to="/cart" class="hover:underline">Warenkorb</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Keine zusätzlichen Skripte erforderlich, da die Navigation über Vue Router funktioniert
</script>

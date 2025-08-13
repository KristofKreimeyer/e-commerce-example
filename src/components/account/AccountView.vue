<template>
  <main class="mx-auto max-w-xl p-6 space-y-4">
    <h1 class="text-2xl font-semibold">Mein Konto</h1>
    <div class="rounded-xl border p-4">
      <p class="text-sm">
        Angemeldet als: <strong>{{ auth.user?.username }}</strong>
      </p>
      <p class="text-sm" v-if="auth.user?.email">
        E-Mail: <strong>{{ auth.user?.email }}</strong>
      </p>
      <p class="text-sm" v-if="auth.user?.name">
        Name: <strong>{{ auth.user?.name }}</strong>
      </p>
    </div>
    <button v-if="auth.isAuthenticated" class="rounded-xl border px-4 py-2" @click="auth.logout()">
      Abmelden
    </button>
  </main>
</template>

<script setup lang="ts">
import { useAuth } from '@/stores/authStore'
const auth = useAuth()
</script>

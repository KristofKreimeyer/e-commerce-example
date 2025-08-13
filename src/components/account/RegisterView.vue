<template>
  <main class="mx-auto max-w-sm p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Registrieren</h1>
    <form class="space-y-4" @submit.prevent="onSubmit" novalidate>
      <div class="space-y-1">
        <label for="name" class="block text-sm font-medium">Name (optional)</label>
        <input
          id="name"
          v-model.trim="name"
          type="text"
          class="w-full rounded-xl border px-3 py-2"
        />
      </div>
      <div class="space-y-1">
        <label for="email" class="block text-sm font-medium">E-Mail</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          required
          class="w-full rounded-xl border px-3 py-2"
        />
      </div>
      <div class="space-y-1">
        <label for="password" class="block text-sm font-medium">Passwort</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full rounded-xl border px-3 py-2"
        />
      </div>
      <button type="submit" class="w-full rounded-xl border px-4 py-2">Konto erstellen</button>
      <p v-if="auth.error" class="text-sm text-red-600" role="alert">{{ auth.error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/authStore'
const auth = useAuth()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
async function onSubmit() {
  await auth.register(email.value, password.value, name.value || undefined)
  router.push({ name: 'account' })
}
</script>

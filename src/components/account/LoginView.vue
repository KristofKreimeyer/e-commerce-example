<template>
  <main class="mx-auto max-w-sm p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Anmelden</h1>

    <form class="space-y-4" @submit.prevent="onSubmit" novalidate>
      <div class="space-y-1">
        <label for="username" class="block text-sm font-medium">Username</label>
        <input
          id="username"
          v-model.trim="username"
          required
          autocomplete="username"
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
          autocomplete="current-password"
          class="w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          :disabled="auth.status === 'loading'"
          class="flex-1 rounded-xl border px-4 py-2"
        >
          {{ auth.status === 'loading' ? 'Bitte warten…' : 'Login' }}
        </button>
        <!-- Demo-Creds aus der FakeStore-API-Doku -->
        <button type="button" class="rounded-xl border px-3 py-2" @click="fillDemo">
          Demo füllen
        </button>
      </div>
      <router-link to="signUp">Noch keinen Account ? Erstell dir hier einen !</router-link>

      <p v-if="auth.error" class="text-sm text-red-600" role="alert">{{ auth.error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const username = ref('')
const password = ref('')

function fillDemo() {
  username.value = 'mor_2314'
  password.value = '83r5^_'
}

async function onSubmit() {
  await auth.login(username.value, password.value)
  const redirect = (route.query.redirect as string) || { name: 'account' }
  router.push(redirect)
}
</script>

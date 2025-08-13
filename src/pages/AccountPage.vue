<script setup lang="ts">
import { useAuth } from '@/stores/authStore'

import AccountView from '@/components/account/AccountView.vue'
import LoginView from '@/components/account/LoginView.vue'

const auth = useAuth()
</script>

<template>
  <main class="mx-auto max-w-xl p-6 space-y-6">
    <!-- 1) Eingeloggt? Dann Account anzeigen -->
    <AccountView v-if="auth.isAuthenticated" />

    <!-- 2) Nicht eingeloggt? Login/Register-Switcher -->
    <section v-else>
      <div>
        <LoginView />
      </div>
    </section>
  </main>
</template>

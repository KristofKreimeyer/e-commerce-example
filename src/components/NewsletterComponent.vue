<template>
  <section class="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <h2 class="text-4xl md:text-5xl font-light apple-text mb-6 tracking-tight">
        Bleib informiert
      </h2>
      <p class="text-xl apple-secondary mb-12">
        Erhalte exklusive Angebote und Neuigkeiten direkt in dein Postfach
      </p>
      <form
        @submit.prevent="subscribeNewsletter"
        class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
      >
        <input
          v-model="email"
          type="email"
          placeholder="Deine E-Mail-Adresse"
          required
          class="flex-1 px-6 py-4 bg-white/80 apple-blur border border-gray-200/50 rounded-full text-sm apple-text focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
        />
        <button
          type="submit"
          class="apple-button text-white px-8 py-4 rounded-full font-medium whitespace-nowrap hover:scale-105 transition-transform"
        >
          Anmelden
        </button>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// Newsletter email input
const email = ref('')

const subscribeNewsletter = (): void => {
  if (email.value) {
    console.log('Newsletter subscription:', email.value)
    // Hier würdest du die Newsletter-Anmeldung verarbeiten
    email.value = ''
    alert('Vielen Dank für deine Anmeldung!')
  }
}
</script>

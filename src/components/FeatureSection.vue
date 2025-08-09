<template>
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="text-center">
          <div
            class="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Truck class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-lg font-semibold apple-text mb-3">Kostenloser Versand</h3>
          <p class="apple-secondary text-sm leading-relaxed">
            Kostenlose Lieferung ab 50€ Bestellwert direkt zu dir nach Hause
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 bg-gradient-to-br from-green-300 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <ShieldCheck class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-lg font-semibold apple-text mb-3">Sichere Bezahlung</h3>
          <p class="apple-secondary text-sm leading-relaxed">
            Deine Daten sind mit modernster Verschlüsselung geschützt
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 bg-gradient-to-br from-purple-300 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <RotateCcw class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-lg font-semibold apple-text mb-3">30 Tage Rückgabe</h3>
          <p class="apple-secondary text-sm leading-relaxed">
            Nicht zufrieden? Kostenlose Rücksendung innerhalb von 30 Tagen
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Truck, ShieldCheck, RotateCcw } from 'lucide-vue-next'
</script>

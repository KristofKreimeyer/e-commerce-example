<template>
  <div class="apple-card apple-blur apple-shadow rounded-3xl p-8 mt-12">
    <div class="space-y-6">
      <!-- Order Summary -->
      <div class="space-y-4">
        <h3 class="text-2xl font-bold text-gray-900 font-sf">Bestellübersicht</h3>
        <div
          v-for="item in items"
          :key="'summary-' + item.id"
          class="flex justify-between items-center py-2"
        >
          <div class="flex items-center space-x-3">
            <span class="text-lg text-gray-700 font-sf">{{ item.name }}</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
              ×{{ item.quantity }}
            </span>
          </div>
          <span class="text-lg font-semibold text-gray-900 font-sf">
            {{ formatEUR(item.price * item.quantity) }}
          </span>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <div class="flex justify-between items-center mb-8">
          <span class="text-3xl font-bold text-gray-900 font-sf">Gesamt:</span>
          <span class="text-4xl font-bold gradient-text font-sf">
            {{ formatEUR(totalPrice) }}
          </span>
        </div>

        <button
          type="button"
          @click="checkout"
          class="apple-button w-full py-6 text-white text-xl font-semibold rounded-2xl shadow-lg font-sf"
        >
          Jetzt kaufen
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '@/stores/cartStore'
import { computed } from 'vue'

const cart = useCartStore()

const items = computed(() => cart.items)

const checkout = () => {
  alert('Vielen Dank für deinen Einkauf!')
  cart.clearCart()
}

const totalPrice = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

// Konsistente Währungsformatierung
const formatEUR = (v: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v)
</script>

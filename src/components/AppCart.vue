<template>
  <div class="p-4">
    <h1 class="text-5xl font-bold mb-4 text-center">Warenkorb</h1>
    <div
      class="border-top border-y-1 w-full py-5 flex justify-between"
      v-for="item in cart.items"
      :key="item.id"
    >
      <div>
        <h2 class="text-2xl font-bold">{{ item.name }}</h2>
        <p>{{ item.price * item.quantity }} €</p>

        <div class="flex items-center space-x-2">
          <button @click="decrease(item.id)" class="px-2 py-1 bg-gray-200">-</button>
          <span class="mx-2">{{ item.quantity }}</span>
          <button @click="increase(item.id)" class="px-2 py-1 bg-gray-200">+</button>
        </div>
      </div>
      <div>
        <img :src="item.image" alt="" class="w-1/4 h-auto aspect-square object-contain" />
      </div>
    </div>
    <div v-if="cart.items.length">
      <div v-for="item in cart.items" :key="item.id" class="mb-2 flex justify-between">
        <div>{{ item.name }} (x{{ item.quantity }})</div>

        <div>
          {{ item.price * item.quantity }} €
          <button @click="remove(item.id)" class="ml-2 text-red-500">Entfernen</button>
        </div>
      </div>
      <div class="mt-4 font-bold">Gesamt: {{ cart.totalPrice }} €</div>
      <button @click="checkout" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Jetzt kaufen
      </button>
    </div>
    <div v-else>Der Warenkorb ist leer.</div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()

const remove = (id: number) => {
  cart.removeFromCart(id)
}

const checkout = () => {
  alert('Vielen Dank für deinen Einkauf!')
  cart.clearCart()
}

const increase = (id: number) => {
  cart.incrementQuantity(id)
}

const decrease = (id: number) => {
  cart.decrementQuantity(id)
}
</script>

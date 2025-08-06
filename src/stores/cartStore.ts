import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as { id: number; name: string; price: number; quantity: number; image: string }[],
  }),
  getters: {
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    addToCart(product: {
      id: number
      name: string
      price: number
      quantity: number
      image: string
    }) {
      const existingItem = this.items.find((item) => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += product.quantity
      } else {
        this.items.push(product)
      }
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter((item) => item.id !== productId)
    },
    clearCart() {
      this.items = []
    },
    incrementQuantity(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.quantity++
    },
    decrementQuantity(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item && item.quantity > 1) {
        item.quantity--
      } else {
        this.removeFromCart(id)
      }
    },
  },
})

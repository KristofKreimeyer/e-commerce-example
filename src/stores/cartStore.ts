import { defineStore } from 'pinia'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export const useCartStore = defineStore('cart', {
  state: (): { items: CartItem[] } => ({
    items: [],
  }),
  getters: {
    totalPrice: (state): number =>
      // leichte Rundung auf 2 Nachkommastellen gegen Floating-Fehler
      Math.round(state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) /
      100,
    itemCount: (state): number => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    addToCart(product: CartItem) {
      const qty = Math.max(1, Number.isFinite(product.quantity) ? product.quantity : 1)
      const existingItem = this.items.find((item) => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += qty
      } else {
        this.items.push({ ...product, quantity: qty })
      }
    },
    removeFromCart(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    clearCart() {
      this.items = []
    },
    incrementQuantity(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.quantity += 1
    },
    decrementQuantity(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        // bei 1 -> nach Klick auf Minus entfernen
        this.removeFromCart(id)
      }
    },
  },
})

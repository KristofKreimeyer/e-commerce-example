/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/cartStore.ts
import { defineStore } from 'pinia'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as CartItem[] }),
  getters: {
    totalPrice: (s) =>
      Math.round(s.items.reduce((sum, it) => sum + it.price * it.quantity, 0) * 100) / 100,
    itemCount: (s) => s.items.reduce((sum, it) => sum + it.quantity, 0),
  },
  actions: {
    addToCart(this: any, p: CartItem) {
      const qty = Math.max(1, Number.isFinite(p.quantity) ? p.quantity : 1)
      const ex = this.items.find((i: CartItem) => i.id === p.id)
      if (ex) {
        ex.quantity += qty
      } else {
        this.items.push({ ...p, quantity: qty })
      }
    },
    removeFromCart(this: any, id: number) {
      this.items = this.items.filter((i: CartItem) => i.id !== id)
    },
    clearCart(this: any) {
      this.items = []
    },
    incrementQuantity(this: any, id: number) {
      const i = this.items.find((i: CartItem) => i.id === id)
      if (i) i.quantity++
    },
    decrementQuantity(this: any, id: number) {
      const i = this.items.find((i: CartItem) => i.id === id)
      if (!i) return
      if (i.quantity > 1) {
        i.quantity--
      } else {
        this.removeFromCart(id)
      }
    },
  },
  persist: {
    key: 'app:cart:v1',
    storage: sessionStorage,
  },
})

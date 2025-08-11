// stores/cartStore.ts
import { defineStore } from 'pinia'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const LS_KEY = 'app:cart:v1'
let subscribed = false

export const useCartStore = defineStore('cart', {
  state: (): { items: CartItem[] } => ({
    items: [],
  }),
  getters: {
    totalPrice: (state): number =>
      Math.round(state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) /
      100,
    itemCount: (state): number => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    // einmal beim App-Start aufrufen (z. B. in App.vue mounted)
    init() {
      if (typeof window === 'undefined') return

      // Hydration
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          this.items = Array.isArray(parsed) ? parsed : []
        }
      } catch {
        this.items = []
      }

      // Persistieren – nur einmal abonnieren
      if (!subscribed) {
        this.$subscribe(
          (_mutation, state) => {
            try {
              localStorage.setItem(LS_KEY, JSON.stringify(state.items))
            } catch {
              /* ignore */
            }
          },
          { detached: true },
        )

        // Cross-Tab-Sync
        window.addEventListener('storage', (e) => {
          if (e.key === LS_KEY) {
            try {
              const next = e.newValue ? JSON.parse(e.newValue) : []
              this.items = Array.isArray(next) ? next : []
            } catch {
              this.items = []
            }
          }
        })
        subscribed = true
      }
    },

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
      try {
        localStorage.removeItem(LS_KEY)
      } catch {}
    },
    incrementQuantity(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.quantity += 1
    },
    decrementQuantity(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      if (item.quantity > 1) item.quantity -= 1
      else this.removeFromCart(id)
    },
  },
})

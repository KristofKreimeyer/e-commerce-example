import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({ ids: [] as number[] }),
  actions: {
    toggle(id: number) {
      const i = this.ids.indexOf(id)
      if (i === -1) {
        this.ids.push(id)
      } else {
        this.ids.splice(i, 1)
      }
      this.persist()
    },
    persist() {
      try {
        localStorage.setItem('wishlist', JSON.stringify(this.ids))
      } catch {}
    },
    hydrate() {
      try {
        const raw = localStorage.getItem('wishlist')
        this.ids = raw ? JSON.parse(raw) : []
      } catch {
        this.ids = []
      }
    },
  },
})

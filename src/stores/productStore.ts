import { defineStore } from 'pinia'

export type Product = {
  id: number
  title: string
  price: number
  image: string
  description: string
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('https://fakestoreapi.com/products')

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()

        this.products = data
      } catch (err: Error | unknown) {
        if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'An unknown error occurred'
        }
      } finally {
        this.loading = false
      }
    },
  },
})

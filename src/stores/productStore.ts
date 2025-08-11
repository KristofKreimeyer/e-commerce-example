// stores/productStore.ts
import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export interface Product {
  id: number
  title: string
  description: string
  category: string
  image: string
  price: number
  rating: { rate: number; count: number }
}

const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS_URL ?? 'https://fakestoreapi.com/products' // Fallback für Dev

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loadedAt = ref<number | null>(null)

  // Der schnelle Lookup: id -> Product
  const productsMap = reactive(new Map<number, Product>())
  function rebuildProductsMap(list: Product[]) {
    productsMap.clear()
    list.forEach((p) => productsMap.set(p.id, p))
  }

  // Nützliche Derivate
  const categories = computed(() => {
    const set = new Set(products.value.map((p) => p.category))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  const has = (id: number) => productsMap.has(id)
  const byId = (id: number) => productsMap.get(id)

  // Optional: kleine Suche/Filter (einfach gehalten)
  const search = (q: string) => {
    const s = q.trim().toLowerCase()
    if (!s) return products.value
    return products.value.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s),
    )
  }

  // Actions
  async function fetchProducts(force = false) {
    if (loading.value) return
    if (!force && products.value.length) return

    loading.value = true
    error.value = null
    try {
      const res = await fetch(PRODUCTS_URL, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as Product[]
      products.value = Array.isArray(data) ? data : []
      rebuildProductsMap(products.value)
      loadedAt.value = Date.now()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Unbekannter Fehler beim Laden der Produkte'
      products.value = []
      productsMap.clear()
      loadedAt.value = null
    } finally {
      loading.value = false
    }
  }

  // Für Tests/SSR/Seeding praktisch
  function setProducts(list: Product[]) {
    products.value = list ?? []
    rebuildProductsMap(products.value)
    loadedAt.value = Date.now()
    error.value = null
  }

  // Setup-Store hat kein $reset – also selbst definieren
  function reset() {
    products.value = []
    productsMap.clear()
    loading.value = false
    error.value = null
    loadedAt.value = null
  }

  // Bequemer Helfer, um lazy zu laden
  async function ensureLoaded() {
    if (!products.value.length && !loading.value) {
      await fetchProducts()
    }
  }

  return {
    // state
    products,
    loading,
    error,
    loadedAt,
    // computed/helpers
    productsMap,
    categories,
    has,
    byId,
    search,
    // actions
    fetchProducts,
    ensureLoaded,
    setProducts,
    reset,
  }
})

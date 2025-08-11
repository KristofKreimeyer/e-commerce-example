// stores/wishlistStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useProductStore, type Product } from './productStore'

const LS_KEY = 'app:wishlist:v1'

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<number[]>([]) // nur IDs

  // --- Hydration aus localStorage + Cross-Tab-Sync ---
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
          // säubern + deduplizieren
          ids.value = Array.from(new Set(parsed.map(Number).filter(Number.isFinite)))
        }
      }
    } catch {
      // optional: console.warn('Wishlist hydration failed', e)
    }

    // Synchronisation zwischen Tabs/Fenstern
    window.addEventListener('storage', (e) => {
      if (e.key === LS_KEY) {
        try {
          const next = e.newValue ? JSON.parse(e.newValue) : []
          if (Array.isArray(next)) {
            ids.value = Array.from(new Set(next.map(Number).filter(Number.isFinite)))
          } else {
            ids.value = []
          }
        } catch {
          ids.value = []
        }
      }
    })
  }
  // ----------------------------------------------------

  const productStore = useProductStore()
  const productsMap = computed(() => productStore.productsMap)

  const items = computed<Product[]>(() =>
    ids.value.map((id) => productsMap.value.get(id)).filter((p): p is Product => p !== undefined),
  )

  const count = computed(() => ids.value.length)
  const has = (id: number) => ids.value.includes(id)
  const add = (id: number) => {
    if (!has(id)) ids.value.push(id)
  }
  const remove = (id: number) => {
    ids.value = ids.value.filter((x) => x !== id)
  }
  const toggle = (id: number) => (has(id) ? remove(id) : add(id))
  const clear = () => {
    ids.value = []
  }

  // --- Persist-Watcher (nach Hydration setzen!) ---
  if (typeof window !== 'undefined') {
    watch(
      ids,
      (val) => {
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(val))
        } catch {}
      },
      { deep: false },
    )
  }
  // -------------------------------------------------

  return { ids, items, count, has, add, remove, toggle, clear }
})

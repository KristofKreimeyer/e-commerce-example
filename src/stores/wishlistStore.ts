// stores/wishlistStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore, type Product } from './productStore'

export const useWishlistStore = defineStore(
  'wishlist',
  () => {
    const ids = ref<number[]>([])
    const productStore = useProductStore()
    const items = computed<Product[]>(() =>
      ids.value
        .map((id) => productStore.productsMap.get(id))
        .filter((p): p is Product => p !== undefined),
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

    return { ids, items, count, has, add, remove, toggle, clear }
  },
  {
    persist: {
      key: 'app:wishlist:v1',
      debug: true,
      afterHydrate(context) {
        console.log('Wishlist store hydrated:', context.store.$id, context.store.ids)
      },
    },
  },
)

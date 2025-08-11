<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section class="container mx-auto px-4 py-8">
    <header class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold apple-text">Wunschzettel</h1>
      <div class="flex gap-2" v-if="wishlist.count">
        <button
          type="button"
          class="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
          @click="addAllToCart"
        >
          Alle in den Warenkorb
        </button>
        <button
          type="button"
          class="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
          @click="confirmClear"
        >
          Wunschzettel leeren
        </button>
      </div>
    </header>

    <div v-if="!wishlist.count" class="rounded-2xl border p-8 text-center">
      <p class="apple-text mb-4">Dein Wunschzettel ist leer.</p>
      <RouterLink to="/" class="underline underline-offset-4">Jetzt Produkte entdecken</RouterLink>
    </div>

    <ul v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <li v-for="p in wishlist.items" :key="p.id">
        <WishlistItem :product="p" @remove="wishlist.remove(p.id)" @add-to-cart="addToCart(p)" />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'
import { useToast } from '@/hooks/useToast'
import WishlistItem from '@/components/Wishlist/WishlistItem.vue'
import type { Product } from '@/stores/productStore'

const wishlist = useWishlistStore()
const cart = useCartStore()
const { success, info } = useToast()

function addToCart(product: Product) {
  cart.addToCart({
    id: product.id,
    name: product.title,
    price: product.price,
    quantity: 1,
    image: product.image,
  })
  success(`„${product.title}“ wurde in den Warenkorb gelegt.`, {
    actionLabel: 'Warenkorb öffnen',
    onAction: () => (window.location.href = '/cart'), // oder router.push
    position: 'bottom-right',
  })
}

function addAllToCart() {
  if (!wishlist.items.length) return
  wishlist.items.forEach((p) =>
    cart.addToCart({ id: p.id, name: p.title, price: p.price, quantity: 1, image: p.image }),
  )
  info(`${wishlist.items.length} Artikel wurden in den Warenkorb gelegt.`)
}

function confirmClear() {
  if (confirm('Wirklich alle Artikel vom Wunschzettel entfernen?')) {
    wishlist.clear()
  }
}
</script>

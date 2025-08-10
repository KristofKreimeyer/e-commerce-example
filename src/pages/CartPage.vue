<template>
  <div class="p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-20 h-20 apple-card apple-blur apple-shadow rounded-3xl mb-6"
        >
          <ShoppingBag class="w-10 h-10 text-blue-600" />
        </div>
        <h1 class="text-6xl font-bold gradient-text mb-4 font-sf">Warenkorb</h1>
      </div>

      <transition-group name="fade" tag="div">
        <div v-if="items.length > 0" key="cart-content" class="space-y-6">
          <!-- Cart Items -->
          <transition-group name="slide-up" tag="div" class="space-y-6">
            <div
              v-for="(item, index) in items"
              :key="item.id"
              class="item-card apple-shadow rounded-3xl p-8"
              :style="{ animationDelay: index * 0.1 + 's' }"
            >
              <CartProductTile
                :item="item"
                :in-wishlist="wishlistIds.has(item.id)"
                @increase="onIncrease"
                @decrease="onDecrease"
                @remove="remove"
                @toggle-wishlist="toggleWishlist"
              />
            </div>
          </transition-group>

          <!-- Summary -->
          <CartSummary :items="items" :totalPrice="totalPrice" />
        </div>

        <!-- Empty -->
        <div v-else key="empty-cart" class="text-center py-20">
          <EmptyCart />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import CartProductTile from '@/components/cart/CartProductTile.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import EmptyCart from '@/components/cart/EmptyCart.vue'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { ShoppingBag } from 'lucide-vue-next'
import { computed } from 'vue'

const cart = useCartStore()
const wishlist = useWishlistStore()

const items = computed(() => cart.items)

const remove = (id: number) => cart.removeFromCart(id)
const onIncrease = (id: number) => cart.incrementQuantity(id)
const onDecrease = (id: number) => cart.decrementQuantity(id)

const toggleWishlist = (id: number) => wishlist.toggle(id)
const wishlistIds = computed(() => new Set(wishlist.ids))

const totalPrice = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
</script>

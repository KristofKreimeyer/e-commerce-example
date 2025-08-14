import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'

// --- Reaktive Store-Mocks ---
const cartStore = reactive({
  items: [] as Array<{ id: number; price: number; quantity: number }>,
  removeFromCart: vi.fn<(id: number) => void>(),
  incrementQuantity: vi.fn<(id: number) => void>(),
  decrementQuantity: vi.fn<(id: number) => void>(),
})
const wishlistStore = reactive({
  ids: [] as number[],
  toggle: vi.fn<(id: number) => void>(),
})

vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => cartStore,
}))
vi.mock('@/stores/wishlistStore', () => ({
  useWishlistStore: () => wishlistStore,
}))

// Icons stubben (optional, für sauberes Rendern)
vi.mock('lucide-vue-next', () => ({
  ShoppingBag: { name: 'ShoppingBag', template: '<i data-icon="bag"></i>' },
}))

// --- Child-Stubs ---
const CartProductTileStub = {
  name: 'CartProductTile',
  props: {
    item: { type: Object, required: true },
    inWishlist: { type: Boolean, default: false },
  },
  emits: ['increase', 'decrease', 'remove', 'toggle-wishlist'],
  template: `
    <div data-test="tile">
      <slot/>
      <button data-test="inc" @click="$emit('increase', item.id)"></button>
      <button data-test="dec" @click="$emit('decrease', item.id)"></button>
      <button data-test="rm"  @click="$emit('remove', item.id)"></button>
      <button data-test="tw"  @click="$emit('toggle-wishlist', item.id)"></button>
    </div>
  `,
}

const CartSummaryStub = {
  name: 'CartSummary',
  props: { items: { type: Array, required: true }, totalPrice: { type: Number, required: true } },
  template: `<div data-test="summary">SUMMARY {{ items.length }} / {{ totalPrice }}</div>`,
}

const EmptyCartStub = {
  name: 'EmptyCart',
  template: `<div data-test="empty">EMPTY</div>`,
}

import CartPage from '../CartPage.vue'

const mountPage = () =>
  mount(CartPage, {
    global: {
      stubs: {
        CartProductTile: CartProductTileStub,
        CartSummary: CartSummaryStub,
        EmptyCart: EmptyCartStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

beforeEach(() => {
  cartStore.items = []
  cartStore.removeFromCart.mockReset()
  cartStore.incrementQuantity.mockReset()
  cartStore.decrementQuantity.mockReset()
  wishlistStore.ids = []
  wishlistStore.toggle.mockReset()
})

describe('CartPage.vue', () => {
  it('zeigt EmptyCart, wenn keine items vorhanden sind', () => {
    const wrapper = mountPage()
    expect(wrapper.find('[data-test="empty"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-test="tile"]')).toHaveLength(0)
    expect(wrapper.find('[data-test="summary"]').exists()).toBe(false)
  })

  it('rendert Tiles & Summary bei Items und setzt inWishlist korrekt', () => {
    cartStore.items = [
      { id: 1, price: 10, quantity: 2 }, // 20
      { id: 2, price: 5, quantity: 3 }, // 15
      { id: 3, price: 4, quantity: 1 }, //  4  => Summe 39
    ]
    wishlistStore.ids = [1, 3]

    const wrapper = mountPage()

    const tiles = wrapper.findAllComponents(CartProductTileStub)
    expect(tiles).toHaveLength(3)

    // Props prüfen: item & inWishlist
    expect(tiles[0].props('item')).toMatchObject({ id: 1, price: 10, quantity: 2 })
    expect(tiles[0].props('inWishlist')).toBe(true)
    expect(tiles[1].props('inWishlist')).toBe(false)
    expect(tiles[2].props('inWishlist')).toBe(true)

    // Summary erhält items & totalPrice = 39
    const summary = wrapper.get('[data-test="summary"]')
    expect(summary.text()).toContain('3 / 39')
  })

  it('verdrahtet Events zu Store-Methoden (increase/decrease/remove/toggle-wishlist)', async () => {
    cartStore.items = [{ id: 7, price: 9, quantity: 1 }]
    const wrapper = mountPage()
    const tile = wrapper.getComponent(CartProductTileStub)

    await tile.get('[data-test="inc"]').trigger('click')
    await tile.get('[data-test="dec"]').trigger('click')
    await tile.get('[data-test="rm"]').trigger('click')
    await tile.get('[data-test="tw"]').trigger('click')

    expect(cartStore.incrementQuantity).toHaveBeenCalledWith(7)
    expect(cartStore.decrementQuantity).toHaveBeenCalledWith(7)
    expect(cartStore.removeFromCart).toHaveBeenCalledWith(7)
    expect(wishlistStore.toggle).toHaveBeenCalledWith(7)
  })

  it('schaltet reaktiv von Content auf Empty um, wenn items geleert werden', async () => {
    cartStore.items = [{ id: 1, price: 1, quantity: 1 }]
    const wrapper = mountPage()
    expect(wrapper.findAll('[data-test="tile"]')).toHaveLength(1)
    expect(wrapper.find('[data-test="empty"]').exists()).toBe(false)

    cartStore.items = []
    await nextTick()

    expect(wrapper.find('[data-test="empty"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-test="tile"]')).toHaveLength(0)
  })
})

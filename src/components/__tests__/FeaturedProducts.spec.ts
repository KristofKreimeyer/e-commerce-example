import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'

// ---- Reaktiver Store-State ----
type P = {
  id: number
  title: string
  image: string
  price: number
  rating: { rate: number; count: number }
}

const state = reactive<{ products: P[] }>({ products: [] })
const fetchProductsMock = vi.fn()
const addToCartMock = vi.fn()

vi.mock('@/stores/productStore', () => ({
  useProductStore: () => ({
    get products() {
      // über reactive state → echte Reaktivität
      return state.products
    },
    fetchProducts: fetchProductsMock,
  }),
}))

vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => ({
    addToCart: addToCartMock,
  }),
}))

import FeaturedProducts from '../FeaturedProducts.vue'

// ---- Child-Stub: ProductCard ----
const ProductCardStub = {
  name: 'ProductCard',
  props: { product: { type: Object, required: true } },
  emits: ['add-to-cart'],
  template: `<div class="product-card-stub" data-test="product-card" @click="$emit('add-to-cart')">
    {{ product.title }}
  </div>`,
}

const mountComp = () =>
  mount(FeaturedProducts, {
    global: {
      stubs: {
        ProductCard: ProductCardStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

// Hilfsdaten
const seededProducts: P[] = [
  { id: 1, title: 'A', image: '/a.png', price: 10, rating: { rate: 3.1, count: 10 } },
  { id: 2, title: 'B', image: '/b.png', price: 12, rating: { rate: 4.9, count: 99 } },
  { id: 3, title: 'C', image: '/c.png', price: 8, rating: { rate: 2.0, count: 5 } },
  { id: 4, title: 'D', image: '/d.png', price: 20, rating: { rate: 4.2, count: 31 } },
  { id: 5, title: 'E', image: '/e.png', price: 18, rating: { rate: 4.2, count: 42 } },
  { id: 6, title: 'F', image: '/f.png', price: 14, rating: { rate: 3.9, count: 17 } },
]

describe('FeaturedProducts.vue', () => {
  beforeEach(() => {
    state.products = [...seededProducts]
    fetchProductsMock.mockReset()
    addToCartMock.mockReset()
  })

  it('rendert Headline und Subtext', () => {
    const wrapper = mountComp()
    const text = wrapper.text()
    expect(text).toContain('Beliebte Produkte')
    expect(text).toContain('Ausgewählte Highlights unserer Kollektion')
  })

  it('zeigt Top-4 Produkte nach Rating (absteigend) und in der richtigen Reihenfolge', () => {
    const wrapper = mountComp()
    const cards = wrapper.findAll('[data-test="product-card"]')
    expect(cards).toHaveLength(4)
    expect(cards.map((c) => c.text().trim())).toEqual(['B', 'D', 'E', 'F'])
  })

  it('verkabelt add-to-cart korrekt', async () => {
    const wrapper = mountComp()
    await wrapper.findAll('[data-test="product-card"]')[0].trigger('click')
    expect(addToCartMock).toHaveBeenCalledWith({
      id: 2,
      name: 'B',
      price: 12,
      quantity: 1,
      image: '/b.png',
    })
  })

  it('ruft fetchProducts() beim Mount auf, wenn keine Produkte vorliegen', async () => {
    state.products = [] // leer
    // fetch füllt den reaktiven State (so wie es echte Pinia-Action tun würde)
    fetchProductsMock.mockImplementation(() => {
      state.products = [
        { id: 9, title: 'Z', image: '/z.png', price: 11, rating: { rate: 4.8, count: 50 } },
        { id: 10, title: 'Y', image: '/y.png', price: 13, rating: { rate: 4.1, count: 10 } },
        { id: 11, title: 'X', image: '/x.png', price: 17, rating: { rate: 3.9, count: 20 } },
        { id: 12, title: 'W', image: '/w.png', price: 15, rating: { rate: 3.5, count: 5 } },
      ]
    })

    const wrapper = mountComp()
    expect(fetchProductsMock).toHaveBeenCalledTimes(1)
    await nextTick()

    const cards = wrapper.findAll('[data-test="product-card"]')
    expect(cards).toHaveLength(4)
  })

  it('ruft fetchProducts() NICHT auf, wenn bereits Produkte existieren', () => {
    mountComp()
    expect(fetchProductsMock).not.toHaveBeenCalled()
  })
})

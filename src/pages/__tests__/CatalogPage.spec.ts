import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'

// ---- Reaktiver Store-Mock ----
type P = {
  id: number
  title: string
  image: string
  price: number
  rating?: { rate: number; count: number }
}

const state = reactive<{ products: P[]; loading: boolean; error: string | null }>({
  products: [],
  loading: false,
  error: null,
})
const fetchProductsMock = vi.fn()

vi.mock('@/stores/productStore', () => {
  // Rückgabe muss reaktiv sein, storeToRefs arbeitet mit dem reaktiven Proxy.
  const store = state as unknown as typeof state & { fetchProducts: typeof fetchProductsMock }
  store.fetchProducts = fetchProductsMock
  return { useProductStore: () => store }
})

// ---- Child-Stub ----
const ProductCardStub = {
  name: 'ProductCard',
  props: { product: { type: Object, required: true } },
  template: `<div data-test="card">{{ product.title }}</div>`,
}

import CatalogPage from '../CatalogPage.vue'

const mountPage = () =>
  mount(CatalogPage, {
    global: {
      stubs: {
        ProductCard: ProductCardStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

beforeEach(() => {
  state.products = []
  state.loading = false
  state.error = null
  fetchProductsMock.mockReset()
})

describe('CatalogPage.vue', () => {
  it('zeigt Ladezustand', () => {
    state.loading = true
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Produkte werden geladen...')
    expect(wrapper.findAll('[data-test="card"]')).toHaveLength(0)
  })

  it('zeigt Fehlerzustand', () => {
    state.error = 'Ups, etwas ist schiefgelaufen'
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Ups, etwas ist schiefgelaufen')
    expect(wrapper.findAll('[data-test="card"]')).toHaveLength(0)
  })

  it('rendert Produktkarten, wenn Produkte vorhanden sind', () => {
    state.products = [
      { id: 1, title: 'Alpha', image: '/a.png', price: 10 },
      { id: 2, title: 'Beta', image: '/b.png', price: 20 },
      { id: 3, title: 'Gamma', image: '/c.png', price: 30 },
    ]
    const wrapper = mountPage()
    const cards = wrapper.findAllComponents(ProductCardStub)
    expect(cards).toHaveLength(3)

    // Prop-Weitergabe prüfen
    expect(cards[0].props('product')).toMatchObject({ id: 1, title: 'Alpha' })
    expect(cards[1].props('product')).toMatchObject({ id: 2, title: 'Beta' })
    expect(cards[2].props('product')).toMatchObject({ id: 3, title: 'Gamma' })
  })

  it('ruft fetchProducts() beim Mount auf, wenn keine Produkte vorhanden sind', () => {
    state.products = [] // leer
    mountPage()
    expect(fetchProductsMock).toHaveBeenCalledTimes(1)
  })

  it('ruft fetchProducts() NICHT auf, wenn bereits Produkte existieren', () => {
    state.products = [{ id: 1, title: 'Alpha', image: '/a.png', price: 10 }]
    mountPage()
    expect(fetchProductsMock).not.toHaveBeenCalled()
  })

  it('rendert reaktiv Karten, wenn Produkte nachträglich geladen werden', async () => {
    state.products = [] // initial leer -> fetch wird gerufen
    const wrapper = mountPage()
    expect(fetchProductsMock).toHaveBeenCalledTimes(1)

    state.loading = false
    state.error = null
    state.products = [
      { id: 9, title: 'Delta', image: '/d.png', price: 12 },
      { id: 8, title: 'Epsilon', image: '/e.png', price: 14 },
    ]
    await nextTick()

    const cards = wrapper.findAll('[data-test="card"]')
    expect(cards).toHaveLength(2)
    expect(cards.map((c) => c.text().trim())).toEqual(['Delta', 'Epsilon'])
  })
})

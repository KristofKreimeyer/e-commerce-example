import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'

// --- Router: useRoute mocken (wir brauchen nur die id) ---
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } }),
}))

// --- Reaktiver Product-Store-Mock ---
type P = {
  id: number
  title: string
  image: string
  images?: string[]
  category: string
  price: number
  description?: string
  rating: { rate: number; count: number }
}

const state = reactive<{ products: P[] }>({ products: [] })
const fetchProductsMock = vi.fn()

vi.mock('@/stores/productStore', () => ({
  useProductStore: () => ({ ...state, fetchProducts: fetchProductsMock }),
}))

// --- Cart-Store-Mock ---
const addToCartMock = vi.fn()
vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => ({ addToCart: addToCartMock }),
}))

// --- Child- & Design-Stubs ---
const ProductGalleryStub = {
  name: 'ProductGallery',
  props: { images: { type: Array, required: true } },
  template: `<div data-test="gallery">GALLERY {{ images.length }}</div>`,
}
const ButtonStub = {
  name: 'ButtonComponent',
  template: `<button data-test="btn"><slot/></button>`,
}

// ⚠️ Pfad zu deiner SFC anpassen!
import ProductDetail from '../ProductDetail.vue'

const mountView = () =>
  mount(ProductDetail, {
    global: {
      stubs: {
        ProductGallery: ProductGalleryStub,
        ButtonComponent: ButtonStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

beforeEach(() => {
  fetchProductsMock.mockReset()
  addToCartMock.mockReset()
  state.products = [
    {
      id: 1,
      title: 'Mega Gadget',
      image: '/mega.png',
      images: ['/a.jpg', '/b.jpg', '/c.jpg'],
      category: 'electronics',
      price: 129.9,
      description: 'Robust. Leicht, schnell; effizient',
      rating: { rate: 3.5, count: 42 },
    },
  ]
})

describe('ProductDetail.vue', () => {
  it('rendert Kategorie, Titel, Preis, Galerie & Beschreibungsteile', async () => {
    const wrapper = mountView()

    // Basics
    expect(wrapper.text()).toContain('electronics')
    expect(wrapper.text()).toContain('Mega Gadget')
    expect(wrapper.text()).toContain('129.90 €') // toFixed(2)

    // Galerie vorhanden & bekommt 3 Bilder
    const gallery = wrapper.find('[data-test="gallery"]')
    expect(gallery.exists()).toBe(true)
    expect(gallery.text()).toContain('3')

    // Description split: 4 sinnvolle Teile (Robust | Leicht | schnell | effizient)
    const items = wrapper.findAll('ul li')
    expect(items.map((li) => li.text())).toEqual(['Robust', 'Leicht', 'schnell', 'effizient'])
  })

  it('berechnet Sterne korrekt für 3.5 (3 voll, 1 halb, 1 leer)', () => {
    const wrapper = mountView()
    // Container mit Sternen (hat die gelbe Textfarbe)
    const starBox = wrapper.find('.text-yellow-500')
    expect(starBox.exists()).toBe(true)

    const spans = starBox.findAll('span')
    const full = spans.filter((s) => s.text() === '★' && !s.classes().includes('opacity-30')).length
    const half = spans.some((s) => s.text() === '☆')
    const empty = spans.filter((s) => s.classes().includes('opacity-30')).length

    expect(full).toBe(3)
    expect(half).toBe(true)
    expect(empty).toBe(1)
    expect(wrapper.text()).toContain('[3.5 / 5 ]')
    expect(wrapper.text()).toContain('42 Bewertungen')
  })

  it('zeigt keine Galerie, wenn es keine Bilder gibt', () => {
    state.products = [
      {
        id: 1,
        title: 'No Pics',
        image: '/x.png',
        images: [], // leer
        category: 'misc',
        price: 10,
        rating: { rate: 0, count: 0 },
        description: '',
      },
    ]
    const wrapper = mountView()
    expect(wrapper.find('[data-test="gallery"]').exists()).toBe(false)
  })

  it('addToCart mappt die Felder korrekt', async () => {
    const wrapper = mountView()
    await wrapper.get('[data-test="btn"]').trigger('click')

    expect(addToCartMock).toHaveBeenCalledTimes(1)
    expect(addToCartMock.mock.calls[0][0]).toMatchObject({
      id: 1,
      name: 'Mega Gadget',
      price: 129.9,
      quantity: 1,
      image: '/mega.png',
    })
  })

  it('ruft fetchProducts() beim Mount auf, wenn Produkt nicht vorhanden, und rendert danach', async () => {
    state.products = [] // leer -> Produkt fehlt zunächst
    const wrapper = mountView()
    expect(fetchProductsMock).toHaveBeenCalledTimes(1)

    // „Serverantwort“ simulieren
    state.products = [
      {
        id: 1,
        title: 'Nachgeladen',
        image: '/z.png',
        images: ['/one.png'],
        category: 'late',
        price: 12,
        description: 'Foo. Bar',
        rating: { rate: 4.2, count: 7 },
      },
    ]
    await nextTick()

    expect(wrapper.text()).toContain('Nachgeladen')
    expect(wrapper.find('[data-test="gallery"]').exists()).toBe(true)
  })
})

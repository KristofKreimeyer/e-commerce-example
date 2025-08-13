// src/components/__tests__/ProductTile.spec.ts
import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks: Stores & Toast ---
const addToCartMock = vi.fn()
const wishlistHasMock = vi.fn().mockReturnValue(false)
const wishlistToggleMock = vi.fn()
const toastSuccessMock = vi.fn()

vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => ({ addToCart: addToCartMock }),
}))
vi.mock('@/stores/wishlistStore', () => ({
  useWishlistStore: () => ({ has: wishlistHasMock, toggle: wishlistToggleMock }),
}))
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: toastSuccessMock }),
}))

// --- Mocks: Icon-Komponenten (Klassen sollen durchgereicht werden) ---
vi.mock('lucide-vue-next', () => {
  const mk = (name: string) => ({
    name,
    template: `<i data-icon="${name}"><slot/></i>`,
  })
  return { Heart: mk('Heart'), Plus: mk('Plus'), Star: mk('Star') }
})

// HINWEIS: Pfad ggf. an deinen Projektbaum anpassen
import ProductTile from '../ProductTile.vue'

const product = {
  id: 42,
  title: 'Test Product',
  category: 'Gizmos',
  image: '/test.png',
  price: 99.95,
  rating: { rate: 3.5, count: 12 },
}

describe('ProductTile', () => {
  beforeEach(() => {
    addToCartMock.mockClear()
    wishlistHasMock.mockReset().mockReturnValue(false)
    wishlistToggleMock.mockClear()
    toastSuccessMock.mockClear()
  })

  const mountCard = () =>
    mount(ProductTile, {
      props: { product },
      global: {
        stubs: {
          // Router isolieren
          'router-link': RouterLinkStub,
          // Button vereinfachen (zwei Instanzen in der Komponente)
          ButtonComponent: { template: '<button data-test="button"><slot/></button>' },
          // Transition aus (stabilere Tests)
          transition: false,
          'transition-group': false,
        },
      },
    })

  it('rendert Titel, Kategorie, Preis und Bild', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain(product.title)
    expect(wrapper.text()).toContain(product.category)
    expect(wrapper.text()).toMatch(/€\s*99\.95/)
    const img = wrapper.get('img')
    expect(img.attributes('src')).toBe(product.image)
    expect(img.attributes('alt')).toBe(product.title)
  })

  it('zeigt Sterne korrekt für 3.5 Bewertung (3 voll, 1 halb, 1 leer)', () => {
    const wrapper = mountCard()
    const stars = wrapper.findAll('[data-icon="Star"]')
    expect(stars).toHaveLength(5)

    // volle Sterne haben text-blue-500
    expect(stars[0].classes()).toContain('text-blue-500')
    expect(stars[1].classes()).toContain('text-blue-500')
    expect(stars[2].classes()).toContain('text-blue-500')

    // halber Stern hat text-blue-300
    expect(stars[3].classes()).toContain('text-blue-300')

    // letzter leer (grau)
    expect(stars[4].classes()).toContain('text-gray-300')

    // Anzeige der Anzahl
    expect(wrapper.text()).toContain(`(${product.rating.count})`)
  })

  it('klick auf Herz toggelt Wishlist mit .stop/.prevent', async () => {
    const wrapper = mountCard()
    const heart = wrapper.get('[data-icon="Heart"]')
    await heart.trigger('click')
    expect(wishlistToggleMock).toHaveBeenCalledTimes(1)
    expect(wishlistToggleMock).toHaveBeenCalledWith(product.id)
    // kein AddToCart/Toast dabei
    expect(addToCartMock).not.toHaveBeenCalled()
    expect(toastSuccessMock).not.toHaveBeenCalled()
  })

  it('klick auf Plus legt in den Warenkorb und zeigt Toast', async () => {
    const wrapper = mountCard()
    const plus = wrapper.get('[data-icon="Plus"]')
    await plus.trigger('click')

    expect(addToCartMock).toHaveBeenCalledTimes(1)
    expect(addToCartMock.mock.calls[0][0]).toMatchObject({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    expect(toastSuccessMock).toHaveBeenCalledTimes(1)
    // grobe Prüfung: Titel steckt im Toast-Text
    expect(String(toastSuccessMock.mock.calls[0][0])).toContain(product.title)
  })

  it('router-link zeigt auf /product/:id', () => {
    const wrapper = mountCard()
    const link = wrapper.getComponent(RouterLinkStub)
    expect(link.props('to')).toBe(`/product/${product.id}`)
  })
})

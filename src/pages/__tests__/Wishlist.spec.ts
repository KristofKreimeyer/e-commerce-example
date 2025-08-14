/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { reactive, nextTick } from 'vue'

// ---- Reaktive Store-Mocks ----
type Product = {
  id: number
  title: string
  image: string
  price: number
  category?: string
  rating?: { rate: number; count: number }
  description?: string
}

const wishlist = reactive<{
  count: number
  items: Product[]
  remove: (id: number) => void
  clear: () => void
}>({
  count: 0,
  items: [],
  remove: vi.fn(),
  clear: vi.fn(),
})

const cart = {
  addToCart: vi.fn(),
}

vi.mock('@/stores/wishlistStore', () => ({
  useWishlistStore: () => wishlist,
}))
vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => cart,
}))

// ---- useToast-Composable mocken ----
const success = vi.fn()
const info = vi.fn()
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success, info }),
}))

// ---- RouterLink & WishlistItem stubs ----
const RouterLinkStub = {
  name: 'RouterLink',
  props: { to: { type: [String, Object], required: true } },
  template: `<a :href="typeof to==='string' ? to : to?.path || '#'" data-stub="router-link"><slot/></a>`,
}

const WishlistItemStub = {
  name: 'WishlistItem',
  props: { product: { type: Object, required: true } },
  emits: ['remove', 'add-to-cart'],
  template: `
    <article data-test="wishlist-item">
      <button data-test="emit-add" @click="$emit('add-to-cart')"></button>
      <button data-test="emit-remove" @click="$emit('remove')"></button>
    </article>
  `,
}

import WishlistPage from '../Wishlist.vue'

const mountPage = () =>
  mount(WishlistPage, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        'router-link': RouterLinkStub,
        WishlistItem: WishlistItemStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

beforeEach(() => {
  wishlist.count = 0
  wishlist.items = []
  ;(wishlist.remove as any).mockReset()
  ;(wishlist.clear as any).mockReset()
  cart.addToCart.mockReset()
  success.mockReset()
  info.mockReset()
})

afterEach(() => {
  // RouterLink-teleport ist hier nicht im Spiel, aber aufräumen schadet nie
  document.body.innerHTML = ''
})

describe('Wishlist.vue', () => {
  it('zeigt Empty-State, wenn wishlist.count = 0', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Dein Wunschzettel ist leer.')
    const link = wrapper.get('[data-stub="router-link"]')
    expect(link.attributes('href')).toBe('/')
    expect(wrapper.findAll('[data-test="wishlist-item"]')).toHaveLength(0)
  })

  it('zeigt Header-Aktionen & Items, wenn wishlist.count > 0', () => {
    wishlist.items = [
      { id: 1, title: 'A', image: '/a.png', price: 10 },
      { id: 2, title: 'B', image: '/b.png', price: 20 },
    ]
    wishlist.count = 2
    const wrapper = mountPage()

    expect(wrapper.find('h1').text()).toBe('Wunschzettel')
    // Buttons vorhanden
    expect(wrapper.text()).toContain('Alle in den Warenkorb')
    expect(wrapper.text()).toContain('Wunschzettel leeren')
    // Items gerendert
    expect(wrapper.findAll('[data-test="wishlist-item"]')).toHaveLength(2)
  })

  it('Event-Wiring: add-to-cart mappt korrekt & zeigt Toast (mit onAction)', async () => {
    const p = { id: 7, title: 'Gizmo', image: '/g.png', price: 99.5 }
    wishlist.items = [p]
    wishlist.count = 1
    const wrapper = mountPage()

    await wrapper.get('[data-test="emit-add"]').trigger('click')

    expect(cart.addToCart).toHaveBeenCalledWith({
      id: 7,
      name: 'Gizmo',
      price: 99.5,
      quantity: 1,
      image: '/g.png',
    })

    expect(success).toHaveBeenCalledTimes(1)
    const [msg, opts] = success.mock.calls[0]
    expect(String(msg)).toContain('Gizmo')
    expect((opts as any).actionLabel).toBe('Warenkorb öffnen')
    expect((opts as any).position).toBe('bottom-right')
    expect(typeof (opts as any).onAction).toBe('function')

    // onAction löst Navigation aus (wir faken window.location)
    const original = window.location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })
    ;(opts as any).onAction()
    expect(window.location.href).toBe('/cart')
    // restore
    Object.defineProperty(window, 'location', { value: original })
  })

  it('Header-Action: "Alle in den Warenkorb" fügt alle hinzu und zeigt Info-Toast', async () => {
    wishlist.items = [
      { id: 1, title: 'A', image: '/a.png', price: 10 },
      { id: 2, title: 'B', image: '/b.png', price: 20 },
      { id: 3, title: 'C', image: '/c.png', price: 5 },
    ]
    wishlist.count = 3
    const wrapper = mountPage()

    await wrapper.get('button:contains("Alle in den Warenkorb")').trigger('click')
    // :contains gibt es in CSS nicht – deshalb alternative Suche:
    const buttons = wrapper.findAll('button')
    const addAll = buttons.find((b) => b.text() === 'Alle in den Warenkorb')!
    await addAll.trigger('click')

    expect(cart.addToCart).toHaveBeenCalledTimes(3)
    expect(info).toHaveBeenCalledTimes(1)
    expect(String(info.mock.calls[0][0])).toContain('3 Artikel')
  })

  it('Header-Action: "Wunschzettel leeren" fragt confirm ab und ruft clear() nur bei OK', async () => {
    wishlist.items = [{ id: 1, title: 'A', image: '/a.png', price: 10 }]
    wishlist.count = 1
    const wrapper = mountPage()

    const btns = wrapper.findAll('button')
    const clearBtn = btns.find((b) => b.text() === 'Wunschzettel leeren')!

    // Abbrechen
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    await clearBtn.trigger('click')
    expect(wishlist.clear).not.toHaveBeenCalled()

    // Bestätigen
    confirmSpy.mockReturnValue(true)
    await clearBtn.trigger('click')
    expect(wishlist.clear).toHaveBeenCalledTimes(1)

    confirmSpy.mockRestore()
  })

  it('Event-Wiring: remove auf Item ruft wishlist.remove(id)', async () => {
    const p = { id: 11, title: 'Z', image: '/z.png', price: 1 }
    wishlist.items = [p]
    wishlist.count = 1
    const wrapper = mountPage()

    await wrapper.get('[data-test="emit-remove"]').trigger('click')
    expect(wishlist.remove).toHaveBeenCalledWith(11)
  })

  it('reagiert auf Statuswechsel: von Items → leer', async () => {
    wishlist.items = [{ id: 1, title: 'A', image: '/a.png', price: 10 }]
    wishlist.count = 1
    const wrapper = mountPage()
    expect(wrapper.findAll('[data-test="wishlist-item"]')).toHaveLength(1)
    expect(wrapper.text()).not.toContain('Dein Wunschzettel ist leer.')

    // Zustand leeren
    wishlist.items = []
    wishlist.count = 0
    await nextTick()

    expect(wrapper.findAll('[data-test="wishlist-item"]')).toHaveLength(0)
    expect(wrapper.text()).toContain('Dein Wunschzettel ist leer.')
  })
})

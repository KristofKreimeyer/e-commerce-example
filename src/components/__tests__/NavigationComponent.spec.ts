import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'

// --- Reaktiver Cart-Store-Mock ---
type CartItem = { id: number }

const cartState = reactive<{ items: Array<CartItem> }>({ items: [] })
vi.mock('@/stores/cartStore', () => ({
  useCartStore: () => cartState,
}))

// --- Icons stubben ---
vi.mock('lucide-vue-next', () => ({
  ShoppingBag: { name: 'ShoppingBag', template: '<i data-icon="bag"></i>' },
  Heart: { name: 'Heart', template: '<i data-icon="heart"></i>' },
  User: { name: 'User', template: '<i data-icon="user"></i>' },
}))

// --- ButtonComponent stubben ---
const ButtonStub = {
  name: 'ButtonComponent',
  template: `<button data-test="btn"><slot/></button>`,
}

// ⚠️ Pfad anpassen:
import NavigationComponent from '../NavigationComponent.vue'

const mountNav = () =>
  mount(NavigationComponent, {
    global: {
      stubs: {
        // beide Schreibweisen absichern
        'router-link': RouterLinkStub,
        RouterLink: RouterLinkStub,
        ButtonComponent: ButtonStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

beforeEach(() => {
  cartState.items = [] // reset
})

describe('NavigationComponent.vue', () => {
  it('rendert Logo-Link auf "/" und zeigt "Shop" + "hub"', () => {
    const wrapper = mountNav()
    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links.length).toBeGreaterThan(0)
    expect(links[0].props('to')).toBe('/')

    const text = wrapper.text()
    expect(text).toContain('Shop')
    expect(text).toContain('hub')
  })

  it('enthält alle erwarteten Navigations-Links in der richtigen Reihenfolge', () => {
    const wrapper = mountNav()
    const tos = wrapper.findAllComponents(RouterLinkStub).map((l) => l.props('to'))

    // Reihenfolge im Template:
    // 0: "/" (Logo), 1: "/catalog", 2: "/wishlist", 3: "/account", 4: "/cart"
    expect(tos).toEqual(['/', '/catalog', '/wishlist', '/account', '/cart'])
  })

  it('zeigt die Warenkorb-Badge nur wenn items > 0 und aktualisiert reaktiv', async () => {
    const wrapper = mountNav()

    // initial: keine Badge
    expect(wrapper.find('[class*="bg-red-500"]').exists()).toBe(false)

    // 1 Artikel → Badge "1"
    cartState.items.push({ id: 1 })
    await nextTick()
    let badge = wrapper.find('[class*="bg-red-500"]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('1')

    // +2 Artikel → Badge "3"
    cartState.items.push({ id: 2 }, { id: 3 })
    await nextTick()
    badge = wrapper.find('[class*="bg-red-500"]')
    expect(badge.text()).toBe('3')

    // leeren → Badge verschwindet
    cartState.items = []
    await nextTick()
    expect(wrapper.find('[class*="bg-red-500"]').exists()).toBe(false)
  })

  it('enthält a11y-Labels für Wunschliste, Login und Warenkorb', () => {
    const wrapper = mountNav()
    const text = wrapper.text()
    expect(text).toContain('Wunschliste')
    expect(text).toContain('Login')
    expect(text).toContain('Warenkorb')
  })
})

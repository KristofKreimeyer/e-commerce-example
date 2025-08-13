import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mock: Product Store ---
type Product = { id: number; title?: string; category: string }
let mockProducts: Product[] = []

vi.mock('@/stores/productStore', () => ({
  useProductStore: () => ({
    // genau das Feld, das die Komponente nutzt
    get products() {
      return mockProducts
    },
  }),
}))

import FeaturedCategories from '../FeaturedCategories.vue'

describe('FeaturedCategories.vue', () => {
  beforeEach(() => {
    mockProducts = [
      { id: 1, category: 'electronics' },
      { id: 2, category: "men's clothing" },
      { id: 3, category: 'electronics' }, // Duplikat
      { id: 4, category: 'jewelery' },
      { id: 5, category: "men's clothing" }, // Duplikat
    ]
  })

  const mountComp = () =>
    mount(FeaturedCategories, {
      global: {
        stubs: {
          'router-link': RouterLinkStub,
          transition: false,
          'transition-group': false,
        },
      },
    })

  it('rendert Heading und Subtext', () => {
    const wrapper = mountComp()
    const txt = wrapper.text()
    expect(txt).toContain('Kategorien')
    expect(txt).toContain('Finde genau das, was du suchst')
  })

  it('rendert nur eindeutige Kategorien in ursprünglicher Reihenfolge', () => {
    const wrapper = mountComp()

    // alle <h3> mit Kategorienamen einsammeln
    const titles = wrapper.findAll('h3').map((h) => h.text().trim())

    // Erwartete Reihenfolge = erste Vorkommen: electronics, men's clothing, jewelery
    expect(titles).toEqual(['electronics', "men's clothing", 'jewelery'])

    // Deduplikation abgesichert
    const set = new Set(titles)
    expect(set.size).toBe(titles.length)
  })

  it('verlinkt jede Kategorie auf /catalog/:category', () => {
    const wrapper = mountComp()
    const links = wrapper.findAllComponents(RouterLinkStub)

    // gleiche Reihenfolge wie die gerenderten Titel
    const tos = links.map((l) => l.props('to'))
    expect(tos).toEqual(['/catalog/electronics', "/catalog/men's clothing", '/catalog/jewelery'])
  })

  it('aktualisiert sich, wenn der Store andere Produkte liefert', async () => {
    const wrapper = mountComp()

    // Zustand ändern (neue Kategorie + ein weiteres Duplikat)
    mockProducts = [
      ...mockProducts,
      { id: 6, category: 'books' },
      { id: 7, category: 'electronics' },
    ]

    // Re-Render anstoßen
    await wrapper.vm.$forceUpdate()

    const titles = wrapper.findAll('h3').map((h) => h.text().trim())
    expect(titles).toEqual(['electronics', "men's clothing", 'jewelery', 'books'])

    const tos = wrapper.findAllComponents(RouterLinkStub).map((l) => l.props('to'))
    expect(tos).toEqual([
      '/catalog/electronics',
      "/catalog/men's clothing",
      '/catalog/jewelery',
      '/catalog/books',
    ])
  })
})

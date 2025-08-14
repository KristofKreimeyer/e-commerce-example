import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

// ⚠️ Pfad anpassen, falls nötig
import WishlistItem from '../WishlistItem.vue'

// RouterLink-Stub, der die "custom"-Slot-Props liefert
const RouterLinkCustomStub = {
  name: 'RouterLink',
  props: {
    to: { type: [String, Object], required: true },
    custom: { type: Boolean, default: false },
  },
  emits: ['navigate'],
  // wir reichen href & navigate in den Slot
  template: `
    <div data-stub="router-link">
      <slot
        :href="typeof to === 'string' ? to : (to?.path ?? '')"
        :navigate="() => $emit('navigate')"
      />
    </div>
  `,
}

describe('WishlistItem.vue', () => {
  const product = {
    id: 42,
    title: 'Ultra Widget',
    image: '/img/ultra.png',
    category: 'gadgets',
    price: 199.99,
    rating: { rate: 4.3, count: 12 }, // falls irgendwo gelesen
    description: '…', // optional
  }

  const mountItem = () =>
    mount(WishlistItem, {
      props: { product },
      global: {
        stubs: {
          RouterLink: RouterLinkCustomStub,
          'router-link': RouterLinkCustomStub, // falls kleingeschrieben verwendet wird
          transition: false,
          'transition-group': false,
        },
      },
    })

  it('rendert Bild, Titel, Kategorie und Preis', () => {
    const wrapper = mountItem()

    const img = wrapper.get('img')
    expect(img.attributes('src')).toBe(product.image)
    expect(img.attributes('alt')).toBe(product.title)

    const text = wrapper.text()
    expect(text).toContain(product.title)
    expect(text).toContain(product.category)
    expect(text).toContain(`€${product.price}`)
  })

  it('setzt Router-Link auf /product/:id und anchor bekommt denselben href', () => {
    const wrapper = mountItem()

    // unser Stub bekommt die "to"-Prop korrekt
    const stub = wrapper.getComponent(RouterLinkCustomStub)
    expect(stub.props('to')).toBe(`/product/${product.id}`)

    // der <a>-Tag erhält vom Slot-Prop das href
    const a = wrapper.get('a')
    expect(a.attributes('href')).toBe(`/product/${product.id}`)
  })

  it('emittiert "add-to-cart" und "remove" über die Buttons', async () => {
    const wrapper = mountItem()

    // 1) Add-to-cart Button (hat den sichtbaren Text)
    const addBtn = wrapper.get('button:not([aria-label])')
    await addBtn.trigger('click')
    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
    expect(wrapper.emitted('add-to-cart')!.length).toBe(1)

    // 2) Remove Button (hat aria-label)
    const removeBtn = wrapper.get('button[aria-label="Aus Wunschzettel entfernen"]')
    await removeBtn.trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')!.length).toBe(1)
  })
})

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Component from '../CatalogPage.vue'

describe('CatalogPage', () => {
  it('renders without crashing (smoke)', () => {
    const wrapper = mount(Component)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders default slot content if any', () => {
    const wrapper = mount(Component, { slots: { default: 'Hello' } })
    // Falls die Komponente Slots rendert, sieht man "Hello", sonst kein Fehler.
    expect(wrapper.text()).toContain('Hello')
  })
})

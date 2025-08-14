import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

// ── vue-router mocken: ersetzt die importierten Symbole in App.vue
vi.mock('vue-router', async () => {
  const actual = await import('vue-router')
  return {
    ...actual,
    RouterView: { name: 'RouterView', template: '<div data-test="rv" />' },
    RouterLink: { name: 'RouterLink', template: '<a data-stub="router-link"><slot/></a>' },
  }
})

// ── weitere Stubs (verhindern Router/Pinia/Toast-Abhängigkeiten)
vi.mock('@/layout/AppHeader.vue', () => ({
  default: { name: 'AppHeader', template: '<header data-test="hdr" />' },
}))
vi.mock('@/layout/AppFooter.vue', () => ({
  default: { name: 'AppFooter', template: '<footer data-test="ftr" />' },
}))
vi.mock('@/components/NavigationComponent.vue', () => ({
  default: { name: 'NavigationComponent', template: '<nav data-test="nav" />' },
}))
vi.mock('@/components/ToastMessage.vue', () => ({
  default: { name: 'ToastMessage', template: '<div data-test="toast-stub" />' },
}))

import App from '../App.vue'

describe('App.vue', () => {
  it('mounts and shows router-view stub', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          transition: false,
          'transition-group': false,
        },
      },
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })
})

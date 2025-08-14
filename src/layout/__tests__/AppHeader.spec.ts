import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

// ⚠️ Pfad anpassen
import AppHeader from '../AppHeader.vue'

// Stub für die Navigation (vermeidet Router/Pinia-Fehler)
const NavigationStub = {
  name: 'NavigationComponent',
  template: `<nav data-test="nav-stub">NAV</nav>`,
}

const mountHeader = () =>
  mount(AppHeader, {
    global: {
      stubs: {
        NavigationComponent: NavigationStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

describe('AppHeader.vue', () => {
  it('rendert ohne Fehler und enthält ein <header>', () => {
    const wrapper = mountHeader()
    expect(wrapper.exists()).toBe(true)
    const header = wrapper.get('header')
    expect(header.classes()).toContain('p-4')
  })

  it('bindet NavigationComponent genau einmal ein', () => {
    const wrapper = mountHeader()
    const nav = wrapper.findAllComponents(NavigationStub)
    expect(nav).toHaveLength(1)
    // und der Stub ist sichtbar
    expect(wrapper.find('[data-test="nav-stub"]').exists()).toBe(true)
  })
})

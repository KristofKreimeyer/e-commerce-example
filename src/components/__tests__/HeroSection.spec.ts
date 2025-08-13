import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import HeroSection from '../HeroSection.vue'

// Stub für ButtonComponent: Props prüfen & Klassen/Attrs übernehmen
const ButtonStub = {
  name: 'ButtonComponent',
  props: {
    type: { type: String, default: 'button' },
    size: { type: String, default: 'md' },
    variant: { type: String, default: 'primary' },
  },
  template: `<button data-test="btn" v-bind="$attrs"><slot/></button>`,
}

describe('HeroSection.vue', () => {
  const mountHero = () =>
    mount(HeroSection, {
      global: {
        stubs: {
          'router-link': RouterLinkStub,
          ButtonComponent: ButtonStub,
          transition: false,
          'transition-group': false,
        },
      },
    })

  it('zeigt Haupt-Headlines und Einleitungstext', () => {
    const wrapper = mountHero()
    expect(wrapper.find('h1').text()).toBe('Premium')
    expect(wrapper.find('h2').text()).toBe('Shopping Experience')
    expect(wrapper.text()).toContain(
      'Entdecke außergewöhnliche Produkte mit der Qualität und dem Design, die du verdienst.',
    )
  })

  it('rendert genau zwei Buttons und setzt Props/Styling korrekt', () => {
    const wrapper = mountHero()
    const btns = wrapper.findAll('[data-test="btn"]')
    expect(btns).toHaveLength(2)

    // 1) "Kollektion entdecken" (im RouterLink)
    const btn1 = btns[0]
    expect(btn1.text()).toContain('Kollektion entdecken')
    // Klassen von der SFC sollten am Stub landen (apple-button etc.)
    const cls1 = btn1.attributes('class') || ''
    expect(cls1).toContain('apple-button')
    expect(cls1).toContain('text-white')
    expect(cls1).toContain('rounded-full')

    // Der umgebende RouterLink zeigt auf /catalog
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/catalog')

    // Props am Stub prüfen (Größe/Variant/Typ)
    const btn1Comp = wrapper.findAllComponents({ name: 'ButtonComponent' })[0]
    expect(btn1Comp.props('type')).toBe('button')
    expect(btn1Comp.props('size')).toBe('lg')
    expect(btn1Comp.props('variant')).toBe('primary')

    // 2) "Mehr erfahren" (kein RouterLink drum herum)
    const btn2 = btns[1]
    expect(btn2.text()).toContain('Mehr erfahren')
    const cls2 = btn2.attributes('class') || ''
    expect(cls2).toContain('border')
    expect(cls2).toContain('border-gray-300')
    expect(cls2).toContain('apple-text')

    const btn2Comp = wrapper.findAllComponents({ name: 'ButtonComponent' })[1]
    expect(btn2Comp.props('type')).toBe('button')
    expect(btn2Comp.props('size')).toBe('lg')
    expect(btn2Comp.props('variant')).toBe('outline')
  })
})

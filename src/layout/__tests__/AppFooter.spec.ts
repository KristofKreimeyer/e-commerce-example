import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

// ⚠️ ggf. Pfad anpassen
import AppFooter from '../AppFooter.vue'

const mountFooter = () =>
  mount(AppFooter, {
    global: {
      stubs: { transition: false, 'transition-group': false },
    },
  })

function getSectionLinkTexts(wrapper: ReturnType<typeof mount>, title: string) {
  const h = wrapper.findAll('h4').find((n) => n.text().trim() === title)
  expect(h, `Section "${title}" not found`).toBeTruthy()
  const sectionEl = h!.element.closest('div') as HTMLElement
  const links = Array.from(sectionEl.querySelectorAll('ul li a')) as HTMLAnchorElement[]
  return links.map((a) => a.textContent?.trim() || '')
}

function getSectionLinkHrefs(wrapper: ReturnType<typeof mount>, title: string) {
  const h = wrapper.findAll('h4').find((n) => n.text().trim() === title)
  expect(h, `Section "${title}" not found`).toBeTruthy()
  const sectionEl = h!.element.closest('div') as HTMLElement
  const links = Array.from(sectionEl.querySelectorAll('ul li a')) as HTMLAnchorElement[]
  return links.map((a) => a.getAttribute('href'))
}

describe('AppFooter.vue', () => {
  it('rendert Branding und Intro-Text', () => {
    const wrapper = mountFooter()
    expect(wrapper.find('h3').text()).toBe('ShopHub')
    expect(wrapper.text()).toContain('Premium E-Commerce Experience')
  })

  it('rendert genau drei Link-Spalten mit je vier Links', () => {
    const wrapper = mountFooter()
    const h4s = wrapper.findAll('h4')
    expect(h4s).toHaveLength(3)
    expect(h4s.map((h) => h.text().trim())).toEqual(['Kundenservice', 'Unternehmen', 'Rechtliches'])

    // Linktexte je Spalte
    expect(getSectionLinkTexts(wrapper, 'Kundenservice')).toEqual([
      'Hilfe & Support',
      'Versand & Rückgabe',
      'Größenleitfaden',
      'Kontakt',
    ])
    expect(getSectionLinkTexts(wrapper, 'Unternehmen')).toEqual([
      'Über uns',
      'Karriere',
      'Nachhaltigkeit',
      'Presse',
    ])
    expect(getSectionLinkTexts(wrapper, 'Rechtliches')).toEqual([
      'Impressum',
      'Datenschutz',
      'AGB',
      'Cookies',
    ])

    // Insgesamt 12 Links
    expect(wrapper.findAll('a')).toHaveLength(12)
  })

  it('alle Links zeigen auf "#" (Platzhalter)', () => {
    const wrapper = mountFooter()
    const allHrefs = [
      ...getSectionLinkHrefs(wrapper, 'Kundenservice'),
      ...getSectionLinkHrefs(wrapper, 'Unternehmen'),
      ...getSectionLinkHrefs(wrapper, 'Rechtliches'),
    ]
    expect(allHrefs.every((h) => h === '#')).toBe(true)
  })

  it('zeigt Copyright-Zeile', () => {
    const wrapper = mountFooter()
    expect(wrapper.text()).toContain('© 2025 ShopHub. Alle Rechte vorbehalten.')
  })
})

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

// Icons mocken (wir brauchen nur Render-Platzhalter)
vi.mock('lucide-vue-next', () => ({
  Truck: { name: 'Truck', template: '<i data-icon="Truck"></i>' },
  ShieldCheck: { name: 'ShieldCheck', template: '<i data-icon="ShieldCheck"></i>' },
  RotateCcw: { name: 'RotateCcw', template: '<i data-icon="RotateCcw"></i>' },
}))

// ⚠️ Pfad zu deiner Komponente anpassen!
import FeatureSection from '../FeatureSection.vue'

describe('FeatureSection.vue', () => {
  const mountComp = () =>
    mount(FeatureSection, {
      global: { stubs: { transition: false, 'transition-group': false } },
    })

  it('rendert genau drei Vorteilskarten', () => {
    const wrapper = mountComp()
    // jede Karte hat den Wrapper .text-center
    expect(wrapper.findAll('.text-center')).toHaveLength(3)
  })

  it('zeigt die korrekten Überschriften und Texte', () => {
    const wrapper = mountComp()

    const headings = wrapper.findAll('h3').map((h) => h.text().trim())
    expect(headings).toEqual(['Kostenloser Versand', 'Sichere Bezahlung', '30 Tage Rückgabe'])

    const paragraphs = wrapper.findAll('p.apple-secondary').map((p) => p.text().trim())
    expect(paragraphs).toEqual([
      'Kostenlose Lieferung ab 50€ Bestellwert direkt zu dir nach Hause',
      'Deine Daten sind mit modernster Verschlüsselung geschützt',
      'Nicht zufrieden? Kostenlose Rücksendung innerhalb von 30 Tagen',
    ])
  })

  it('rendert die drei Icons (Truck, ShieldCheck, RotateCcw)', () => {
    const wrapper = mountComp()
    for (const name of ['Truck', 'ShieldCheck', 'RotateCcw']) {
      expect(wrapper.find(`[data-icon="${name}"]`).exists()).toBe(true)
    }
  })

  it('enthält pro Karte die dekorative Verlauf-Box', () => {
    const wrapper = mountComp()
    // die Box hat diese Basis-Klassen
    const boxes = wrapper.findAll('.w-16.h-16.rounded-2xl')
    expect(boxes.length).toBe(3)
  })
})

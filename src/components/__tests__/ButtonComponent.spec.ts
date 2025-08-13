/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ButtonComponent from '../ButtonComponent.vue'

describe('ButtonComponent.vue', () => {
  const mountBtn = (
    props: Record<string, unknown> = {},
    attrs: Record<string, unknown> = {},
    slots: Record<string, any> = {},
  ) =>
    mount(ButtonComponent, {
      props,
      attrs,
      slots,
      global: {
        stubs: { transition: false, 'transition-group': false },
      },
    })

  beforeEach(() => {
    // noop
  })

  it('rendert Slot-Inhalt und forwarded $attrs', () => {
    const wrapper = mountBtn(
      {},
      { 'aria-label': 'Kaufen', class: 'u-extra' },
      { default: 'Buy me' },
    )
    const btn = wrapper.get('button')
    expect(btn.text()).toContain('Buy me')
    expect(btn.attributes('aria-label')).toBe('Kaufen')
    // zusätzliche Klassen via $attrs werden gemerged
    expect(btn.attributes('class')).toContain('u-extra')
  })

  it('hat korrekte Defaults: type="button", variant="primary", size="md"', () => {
    const wrapper = mountBtn()
    const btn = wrapper.get('button')
    expect(btn.attributes('type')).toBe('button')
    const cls = btn.attributes('class') || ''
    // Variant "primary"
    expect(cls).toContain('apple-button')
    expect(cls).toContain('text-white')
    expect(cls).toContain('shadow-lg')
    // Size "md" (Text-Button)
    expect(cls).toContain('px-6')
    expect(cls).toContain('py-2.5')
    expect(cls).toContain('text-sm')
    // nicht disabled
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('emittiert click-Event mit MouseEvent, wenn nicht disabled/loading', async () => {
    const wrapper = mountBtn({}, {}, { default: 'Click' })
    const btn = wrapper.get('button')
    await btn.trigger('click')
    const emitted = wrapper.emitted('click')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBeInstanceOf(MouseEvent)
  })

  it('setzt type auf "submit" wenn angegeben', () => {
    const wrapper = mountBtn({ type: 'submit' })
    expect(wrapper.get('button').attributes('type')).toBe('submit')
  })

  it('variant="outline" + size="lg" setzt passende Klassen', () => {
    const wrapper = mountBtn({ variant: 'outline', size: 'lg' }, {}, { default: 'Outline' })
    const cls = wrapper.get('button').attributes('class') || ''
    // Outline-Variante
    expect(cls).toContain('border')
    expect(cls).toContain('border-gray-300')
    expect(cls).toContain('apple-text')
    expect(cls).toContain('hover:bg-gray-50')
    // Größe lg (Text-Button)
    expect(cls).toContain('px-8')
    expect(cls).toContain('py-4')
    expect(cls).toContain('text-lg')
  })

  it('variant="icon" + size="sm" nutzt Icon-Größenklassen und Icon-Variant-Klassen', () => {
    const wrapper = mountBtn({ variant: 'icon', size: 'sm' })
    const cls = wrapper.get('button').attributes('class') || ''
    // Icon-Variante
    expect(cls).toContain('bg-white/80')
    expect(cls).toContain('apple-blur')
    expect(cls).toContain('hover:bg-white')
    // Icon-Größe sm
    expect(cls).toContain('w-8')
    expect(cls).toContain('h-8')
    expect(cls).toContain('p-0')
  })

  it('disabled=true setzt disabled-Attribut und verhindert Interaktion-Styles', async () => {
    const wrapper = mountBtn({ disabled: true })
    const btn = wrapper.get('button')
    expect(btn.attributes('disabled')).toBeDefined()
    // Tailwind disabled:*-Klassen sind in der Klasseliste sichtbar
    const cls = btn.attributes('class') || ''
    expect(cls).toContain('disabled:opacity-50')
    expect(cls).toContain('disabled:cursor-not-allowed')
    // Klick sollte nicht emittieren (Browser blockt disabled)
    await btn.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('loading=true deaktiviert Button & zeigt cursor-wait', async () => {
    const wrapper = mountBtn({ loading: true })
    const btn = wrapper.get('button')
    expect(btn.attributes('disabled')).toBeDefined()
    const cls = btn.attributes('class') || ''
    expect(cls).toContain('cursor-wait')
    // Klick sollte nicht emittieren
    await btn.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})

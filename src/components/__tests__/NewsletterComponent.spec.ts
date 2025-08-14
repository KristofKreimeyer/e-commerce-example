import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import NewsletterComponent from '../NewsletterComponent.vue'

describe('NewsletterComponent.vue', () => {
  let alertSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    alertSpy = vi.fn()
    // window.alert in jsdom mocken
    vi.stubGlobal('alert', alertSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const mountComp = () =>
    mount(NewsletterComponent, {
      global: {
        stubs: { transition: false, 'transition-group': false },
      },
    })

  it('rendert Headline, Subtext und Button', () => {
    const wrapper = mountComp()
    const text = wrapper.text()

    expect(text).toContain('Bleib informiert')
    expect(text).toContain('Erhalte exklusive Angebote und Neuigkeiten direkt in dein Postfach')

    const btn = wrapper.get('button[type="submit"]')
    expect(btn.text()).toBe('Anmelden')
  })

  it('E-Mail-Input hat Typ, Placeholder und required', () => {
    const wrapper = mountComp()
    const input = wrapper.get('input[type="email"]')
    expect(input.attributes('placeholder')).toBe('Deine E-Mail-Adresse')
    expect(input.attributes('required')).toBeDefined()
  })

  it('valides Submit ruft alert und leert das Feld (v-model Reset)', async () => {
    const wrapper = mountComp()
    const input = wrapper.get('input[type="email"]')
    const form = wrapper.get('form')

    await input.setValue('user@example.com')
    await form.trigger('submit.prevent')

    expect(alertSpy).toHaveBeenCalledTimes(1)
    // Textinhalt grob prüfen
    expect(String(alertSpy.mock.calls[0][0])).toContain('Vielen Dank')

    // v-model wird im Handler geleert
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('leeres Submit (ohne Email) ruft KEIN alert auf', async () => {
    const wrapper = mountComp()
    const form = wrapper.get('form')

    await form.trigger('submit.prevent')

    expect(alertSpy).not.toHaveBeenCalled()
  })
})

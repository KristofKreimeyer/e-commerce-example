import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'

// ⚠️ Pfad zu deiner SFC anpassen!
import LoadingComponent from '../LoadingComponent.vue'

afterEach(() => {
  vi.useRealTimers()
})

describe('LoadingComponent.vue', () => {
  it('zeigt initial den Ladezustand (Spinner + Text)', () => {
    vi.useFakeTimers()
    const wrapper = mount(LoadingComponent)

    // Spinner vorhanden
    const spinner = wrapper.find('.animate-spin')
    expect(spinner.exists()).toBe(true)

    // Lade-Text vorhanden
    expect(wrapper.text()).toContain('Produkte werden geladen')
  })

  it('blendet nach 2s den Ladezustand aus', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LoadingComponent)

    // nach 1.999 ms noch sichtbar
    vi.advanceTimersByTime(1999)
    await nextTick()
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.text()).toContain('Produkte werden geladen')

    // nach 2.000 ms ausgeblendet
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(wrapper.find('.animate-spin').exists()).toBe(false)
    // Komponente rendert dann nichts mehr
    expect(wrapper.text().trim()).toBe('')
  })
})

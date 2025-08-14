import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'

// --- Reaktiver Toast-Store (Composable) ---
type Toast = {
  id: string | number
  message: string
  type?: 'success' | 'info' | 'error'
  position?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
  actionLabel?: string
  onAction?: () => void
}

const toastsRef = ref<Toast[]>([])
const dismissMock = vi.fn()

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toasts: toastsRef, dismiss: dismissMock }),
}))

// ⚠️ Pfad zu deiner SFC anpassen:
import ToastMessage from '../ToastMessage.vue'

/** kleine Helper, weil Teleport in <body> rendert */
const qAll = (sel: string) => Array.from(document.body.querySelectorAll(sel)) as HTMLElement[]
const qOne = (sel: string) => document.body.querySelector(sel) as HTMLElement | null

describe('ToastMessage.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    toastsRef.value = []
    dismissMock.mockReset()
    document.body.innerHTML = '' // Teleport-Cleanup
  })

  afterEach(() => {
    wrapper?.unmount()
    document.body.innerHTML = ''
  })

  const mountComp = () =>
    mount(ToastMessage, {
      attachTo: document.body, // wichtig für Teleport
      global: {
        stubs: { transition: false, 'transition-group': false },
      },
    })

  it('gruppiert nach Position und rendert ARIA-Role/Live korrekt', async () => {
    toastsRef.value = [
      { id: 1, message: 'Alles gut', type: 'success', position: 'top-left' },
      { id: 2, message: 'Upps! Fehler', type: 'error', position: 'bottom-center' },
    ]
    wrapper = mountComp()
    await nextTick()

    // zwei Container (je Position)
    const containers = qAll('[aria-atomic="true"]')
    expect(containers.length).toBe(2)

    // Klassen der Container prüfen
    const cls = (el: Element) => (el as HTMLElement).className
    expect(cls(containers[0])).toContain('top-4') // top-left
    expect(cls(containers[0])).toContain('left-4')
    expect(cls(containers[1])).toContain('bottom-4') // bottom-center
    expect(cls(containers[1])).toContain('left-1/2')
    expect(cls(containers[1])).toContain('-translate-x-1/2')

    // ARIA (success/info => status/polite, error => alert/assertive)
    const status = qAll('div[role="status"]')
    const alert = qAll('div[role="alert"]')
    expect(status.some((n) => n.textContent?.includes('Alles gut'))).toBe(true)
    expect(status[0].getAttribute('aria-live')).toBe('polite')
    expect(alert.some((n) => n.textContent?.includes('Upps! Fehler'))).toBe(true)
    expect(alert[0].getAttribute('aria-live')).toBe('assertive')
  })

  it('default-Position ist top-right, wenn keine position angegeben ist', async () => {
    toastsRef.value = [{ id: 3, message: 'Ohne Position' }]
    wrapper = mountComp()
    await nextTick()

    const container = qOne('[aria-atomic="true"]')
    expect(container).not.toBeNull()
    const classes = container!.className
    expect(classes).toContain('top-4')
    expect(classes).toContain('right-4') // Default
  })

  it('Action-Button ruft onAction und dismiss(id) auf', async () => {
    const onAction = vi.fn()
    toastsRef.value = [
      { id: 10, message: 'Mit Aktion', actionLabel: 'Öffnen', onAction, position: 'top-right' },
    ]
    wrapper = mountComp()
    await nextTick()

    const btn = qAll('button').find((b) => b.textContent?.trim() === 'Öffnen')
    expect(btn).toBeDefined()
    btn!.click()
    await nextTick()

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(dismissMock).toHaveBeenCalledWith(10)
  })

  it('Schließen-Button (✕) ruft dismiss(id) auf', async () => {
    toastsRef.value = [{ id: 11, message: 'Zum Schließen', position: 'top-right' }]
    wrapper = mountComp()
    await nextTick()

    const close = qOne('button[aria-label="Toast schließen"]')
    expect(close).not.toBeNull()
    close!.click()
    await nextTick()

    expect(dismissMock).toHaveBeenCalledWith(11)
  })

  it('ESC schließt den letzten Toast (stack-top)', async () => {
    toastsRef.value = [
      { id: 'a', message: 'Erster' },
      { id: 'b', message: 'Letzter' },
    ]
    wrapper = mountComp()
    await nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(dismissMock).toHaveBeenCalledTimes(1)
    expect(dismissMock).toHaveBeenCalledWith('b')
  })
})

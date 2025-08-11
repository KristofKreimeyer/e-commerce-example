import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'
export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'
export type ToastPoliteness = 'polite' | 'assertive'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number | null
  position?: ToastPosition
  closeButton?: boolean
  actionLabel?: string // optional!
  onAction?: () => void
  politeness?: ToastPoliteness // steuert aria-live/role in der UI
}

const toasts = ref<Toast[]>([])
const timers = new Map<string, number>()

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

export function useToast() {
  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
    const tid = timers.get(id)
    if (tid) {
      clearTimeout(tid)
      timers.delete(id)
    }
  }

  // type optional machen, damit 'info' defaulten kann
  const show = (t: Omit<Toast, 'id' | 'type'> & { type?: ToastType }) => {
    const toast: Toast = {
      id: uuid(),
      type: t.type ?? 'info',
      duration: t.duration ?? 50000,
      position: t.position ?? 'top-right',
      closeButton: t.closeButton ?? true,
      politeness: t.politeness ?? ((t.type ?? 'info') === 'error' ? 'assertive' : 'polite'),
      ...t,
    }
    toasts.value.push(toast)

    // Auto-Dismiss (nicht bei Errors)
    if (toast.duration && toast.type !== 'error') {
      const tid = window.setTimeout(() => dismiss(toast.id), toast.duration)
      timers.set(toast.id, tid)
    }

    return toast.id
  }

  const clearAll = () => {
    for (const id of timers.keys()) clearTimeout(timers.get(id)!)
    timers.clear()
    toasts.value = []
  }

  return {
    toasts,
    show,
    dismiss,
    clearAll,
    success: (message: string, opts: Partial<Toast> = {}) =>
      show({ message, type: 'success', ...opts }),
    error: (message: string, opts: Partial<Toast> = {}) =>
      show({ message, type: 'error', duration: null, politeness: 'assertive', ...opts }),
    info: (message: string, opts: Partial<Toast> = {}) => show({ message, type: 'info', ...opts }),
  }
}

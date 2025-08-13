import { beforeAll, vi } from 'vitest'
import { config } from '@vue/test-utils'

// JSDOM-Fixes (z. B. matchMedia / ResizeObserver)
beforeAll(() => {
  if (!('matchMedia' in window)) {
    // @ts-expect-error test env
    window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} })
  }
  if (!('ResizeObserver' in window)) {
    // @ts-expect-error test env
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

// Router/Transitions neutralisieren
config.global.stubs = {
  'router-link': { template: '<a><slot/></a>' },
  'router-view': { template: '<div data-test="router-view"><slot/></div>' },
  transition: false,
  'transition-group': false,
}

// Icon-/3rd-party-Komponenten stubben (lucide, Swiper etc.)
vi.mock('lucide-vue-next', () => ({
  // simple icon stub
  X: { template: '<svg data-test="icon-x" />' },
}))
vi.mock('swiper/vue', () => ({
  Swiper: { template: '<div data-test="swiper"><slot/></div>' },
  SwiperSlide: { template: '<div data-test="swiper-slide"><slot/></div>' },
}))

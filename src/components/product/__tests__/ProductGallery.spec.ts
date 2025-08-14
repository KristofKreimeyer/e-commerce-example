import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'

// --- CSS-Side-Effect-Imports mocken (sonst Node-Fehler im Test) ---
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/free-mode', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('swiper/css/thumbs', () => ({}))
vi.mock('swiper/css/zoom', () => ({}))

// --- Swiper-Komponenten mocken ---
vi.mock('swiper/vue', () => {
  const Swiper = {
    name: 'Swiper',
    // 👉 Props explizit deklarieren, damit VTU sie über .props() sieht
    props: {
      navigation: { type: [Boolean, Object], default: undefined },
      spaceBetween: { type: Number, default: undefined },
      slidesPerView: { type: [Number, String], default: undefined },
      watchSlidesProgress: { type: Boolean, default: undefined },
      modules: { type: Array, default: () => [] },
      thumbs: { type: Object, default: undefined },
    },
    emits: ['swiper'],
    // class / style etc. aus $attrs weiterreichen (für .mySwiper2/.mySwiper Selektoren)
    template: `<div class="swiper" v-bind="$attrs"><slot/></div>`,
  }

  const SwiperSlide = {
    name: 'SwiperSlide',
    template: `<div class="swiper-slide"><slot/></div>`,
  }

  return { Swiper, SwiperSlide }
})

// --- Module mocken (wir wollen nur Identitäten prüfen) ---
vi.mock('swiper/modules', () => {
  const FreeMode = { __name: 'FreeMode' }
  const Navigation = { __name: 'Navigation' }
  const Thumbs = { __name: 'Thumbs' }
  return { FreeMode, Navigation, Thumbs }
})

// nach den Mocks importieren, damit die Mocks greifen
import ProductGallery from '../ProductGallery.vue'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'

describe('ProductGallery.vue', () => {
  const images = ['/a.jpg', '/b.jpg', '/c.jpg']

  beforeEach(() => {
    // nothing special
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  const mountGallery = () =>
    mount(ProductGallery, {
      props: { images },
      global: {
        // Transitions aus → stabilere Tests
        stubs: { transition: false, 'transition-group': false },
      },
    })

  it('rendert Haupt- und Thumbnail-Swiper mit korrekter Anzahl Bilder', () => {
    const wrapper = mountGallery()

    const main = wrapper.find('.mySwiper2')
    expect(main.exists()).toBe(true)
    expect(main.findAll('img')).toHaveLength(images.length)

    const thumbs = wrapper.find('.mySwiper')
    expect(thumbs.exists()).toBe(true)
    expect(thumbs.findAll('img')).toHaveLength(images.length)
  })

  it('übergibt Props an die Swiper korrekt (navigation/spaceBetween/modules etc.)', () => {
    const wrapper = mountGallery()

    // Wir greifen auf die beiden Swiper-Komponenten zu
    const swipers = wrapper.findAllComponents({ name: 'Swiper' })
    expect(swipers).toHaveLength(2)

    const main = swipers[0]
    const thumbs = swipers[1]

    // Hauptswiper-Props
    expect(main.props('navigation')).toBe(true)
    expect(main.props('spaceBetween')).toBe(10)

    // Thumbnails-Props
    expect(thumbs.props('slidesPerView')).toBe(4)
    expect(thumbs.props('watchSlidesProgress')).toBe(true)
    expect(thumbs.props('spaceBetween')).toBe(10)

    // Module-Array vorhanden und enthält unsere drei Module
    const m1 = main.props('modules') as unknown[]
    const m2 = thumbs.props('modules') as unknown[]
    expect(Array.isArray(m1) && m1.length).toBeTruthy()
    expect(Array.isArray(m2) && m2.length).toBeTruthy()

    // Identitäten prüfen (kommen aus demselben Mock)
    expect(m1).toEqual([FreeMode, Navigation, Thumbs])
    expect(m2).toEqual([FreeMode, Navigation, Thumbs])
  })

  it('verknüpft Thumbnails mit Hauptswiper via @swiper (thumbs.swiper)', async () => {
    const wrapper = mountGallery()
    const swipers = wrapper.findAllComponents({ name: 'Swiper' })
    const main = swipers[0]
    const thumbs = swipers[1]

    // initial sollte thumbs.swiper null/undefined sein
    const initialThumbs = main.props('thumbs') as Record<string, unknown>
    expect(initialThumbs).toBeTruthy()
    expect(initialThumbs.swiper == null).toBe(true)

    // "Swiper"-Instanz im Thumbnail emittieren
    const fakeSwiper = { id: 'fake-thumbs' }
    thumbs.vm.$emit('swiper', fakeSwiper)

    await nextTick()

    // nach dem Event sollte der Hauptswiper die Thumbs-Instanz referenzieren
    const updatedThumbs = main.props('thumbs') as Record<string, unknown>
    expect(updatedThumbs?.swiper).toBe(fakeSwiper)
  })
})

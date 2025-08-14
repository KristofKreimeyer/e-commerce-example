import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import HomePage from '../HomePage.vue'

// Stubs für die Kind-Komponenten: superleicht, aber mit data-test Hooks
const HeroStub = { name: 'HeroSection', template: '<section data-test="hero">HERO</section>' }
const FeatureStub = {
  name: 'FeatureSection',
  template: '<section data-test="features">FEATURES</section>',
}
const CategoriesStub = {
  name: 'FeaturedCategories',
  template: '<section data-test="categories">CATEGORIES</section>',
}
const ProductsStub = {
  name: 'FeaturedProducts',
  template: '<section data-test="featured-products">FEATURED_PRODUCTS</section>',
}
const NewsletterStub = {
  name: 'NewsletterComponent',
  template: '<section data-test="newsletter">NEWSLETTER</section>',
}

const mountPage = () =>
  mount(HomePage, {
    global: {
      stubs: {
        HeroSection: HeroStub,
        FeatureSection: FeatureStub,
        FeaturedCategories: CategoriesStub,
        FeaturedProducts: ProductsStub,
        NewsletterComponent: NewsletterStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

describe('HomePage.vue', () => {
  it('rendert alle Abschnitte genau einmal', () => {
    const wrapper = mountPage()
    expect(wrapper.find('[data-test="hero"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="features"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="categories"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="featured-products"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="newsletter"]').exists()).toBe(true)

    // keine Duplikate
    expect(wrapper.findAll('[data-test="hero"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="features"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="categories"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="featured-products"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="newsletter"]')).toHaveLength(1)
  })

  it('rendert die Abschnitte in der richtigen Reihenfolge', () => {
    const wrapper = mountPage()
    const sections = wrapper.findAll('section')
    const order = sections.map((s) => s.attributes('data-test'))

    expect(order).toEqual(['hero', 'features', 'categories', 'featured-products', 'newsletter'])
  })
})

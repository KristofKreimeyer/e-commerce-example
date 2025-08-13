import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '../App.vue'

describe('App.vue', () => {
  it('mounts and shows router-view stub', () => {
    const wrapper = mount(App)
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
  })
})

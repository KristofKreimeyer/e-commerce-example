import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'

// --- Reaktiver Auth-Store-Mock ---
const authState = reactive({ isAuthenticated: false })
vi.mock('@/stores/authStore', () => ({
  useAuth: () => authState,
}))

// --- Child-Stubs ---
const AccountViewStub = { name: 'AccountView', template: '<div data-test="account">ACCOUNT</div>' }
const LoginViewStub = { name: 'LoginView', template: '<div data-test="login">LOGIN</div>' }

import AccountPage from '../AccountPage.vue'

const mountPage = () =>
  mount(AccountPage, {
    global: {
      stubs: {
        AccountView: AccountViewStub,
        LoginView: LoginViewStub,
        transition: false,
        'transition-group': false,
      },
    },
  })

describe('AccountPage.vue', () => {
  beforeEach(() => {
    authState.isAuthenticated = false
  })

  it('zeigt LoginView wenn nicht eingeloggt', () => {
    const wrapper = mountPage()
    expect(wrapper.find('[data-test="login"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="account"]').exists()).toBe(false)
  })

  it('zeigt AccountView wenn eingeloggt (reaktiv)', async () => {
    const wrapper = mountPage()
    authState.isAuthenticated = true
    await nextTick()
    expect(wrapper.find('[data-test="account"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="login"]').exists()).toBe(false)
  })
})

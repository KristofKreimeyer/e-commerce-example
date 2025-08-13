/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { loginApi, getUserByUsername, type FSUser } from '@/auth/authApi'
import router from '@/router'

export type User = { id: number; email?: string; username: string; name?: string }
type Status = 'idle' | 'loading' | 'error'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    status: 'idle' as Status,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
  },
  actions: {
    async login(username: string, password: string) {
      this.status = 'loading'
      this.error = null
      try {
        const { token } = await loginApi(username, password)
        this.token = token

        // Optionales Profil: versuch, Userdaten via /users zu mappen
        let profile: FSUser | null = null
        try {
          profile = await getUserByUsername(username)
        } catch {
          /* Profil ist nice-to-have */
        }

        this.user = profile
          ? {
              id: profile.id,
              email: profile.email,
              username: profile.username,
              name:
                [profile.name?.firstname, profile.name?.lastname].filter(Boolean).join(' ') ||
                undefined,
            }
          : { id: -1, username }
      } catch (e: any) {
        this.error = e?.message ?? 'Login fehlgeschlagen.'
        this.token = null
        this.user = null
        throw e
      } finally {
        this.status = 'idle'
      }
    },
    async logout() {
      this.token = null
      this.user = null
      router.replace({ path: '/signIn', query: { redirect: '/' } })
    },
    async register(email: string, password: string, name?: string) {
      return { email, password, name }
    },
  },
  persist: { key: 'auth' },
})

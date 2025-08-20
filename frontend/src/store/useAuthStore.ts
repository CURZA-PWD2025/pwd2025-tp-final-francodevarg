import { defineStore } from 'pinia'

export interface AuthUser {
  nombre: string
  email: string
  telefono: string
}

const STORAGE_KEY = 'fake_auth_user'

export const useAuthStore = defineStore('auth', {
  state: (): { user: AuthUser | null } => ({
    user: loadUser(),
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    loginFake(payload: AuthUser) {
      this.user = payload
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
    logout() {
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

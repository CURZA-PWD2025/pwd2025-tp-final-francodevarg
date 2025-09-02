import { defineStore } from 'pinia'
import { instance as axios } from '@/plugins/axios'
import AuthService from '@/services/AuthService'
import type { User, AuthResponse } from '@/types/Auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null
  }),
  actions: {
    async login(email: string, password: string) {
      const data: AuthResponse = await AuthService.login({ email, password })
      this.user = { id: data.id, nombre: data.nombre, email: data.email, tipo: data.tipo }
      this.token = data.token

      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    },

    async register(email: string, nombre: string, password: string, tipo: 'cliente' | 'admin' = 'cliente') {
      const data: AuthResponse = await AuthService.register({ email, nombre, password, tipo })
      this.user = { id: data.id, nombre: data.nombre, email: data.email, tipo: data.tipo }
      this.token = data.token

      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    },

    async logout() {
      try {
        await AuthService.logout()
      } catch (err) {
        console.warn('Error al hacer logout en backend:', err)
      } finally {
        this.user = null
        this.token = null
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },

    restoreSession() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
  }
})

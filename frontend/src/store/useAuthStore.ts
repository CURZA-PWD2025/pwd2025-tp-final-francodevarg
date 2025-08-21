// @/store/useAuthStore.ts
import { defineStore } from 'pinia'
import { instance as axios } from '@/plugins/axios'
import AuthService from '@/services/AuthService'

interface User {
  id: number
  nombre: string
  email: string
  tipo: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async login(email: string, password: string) {
      const data = await AuthService.login(email, password)

      const { id, nombre, email: userEmail, tipo, token } = data
      this.user = { id, nombre, email: userEmail, tipo }
      this.token = token

      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})

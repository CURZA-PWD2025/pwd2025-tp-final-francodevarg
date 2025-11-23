import { defineStore } from 'pinia'
import { instance as axios } from '@/plugins/axios'
import AuthService from '@/services/AuthService'
import type { AuthPayload } from '@/types/Auth'
import type { Usuario } from '@/types/Usuario'

// Helper para decodificar JWT
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    console.log(jsonPayload)
    return JSON.parse(jsonPayload)
  } catch (err) {
    console.error('Error decodificando JWT:', err)
    return null
  }
}

// Configuración de carga de datos por tipo de usuario
const USER_DATA_CONFIG = {
  cliente: {
    load: async (userId: number) => {
      const { useMascotaStore } = await import('@/store/useMascotaStore')
      const { useMisTurnos } = await import('@/store/useMisTurnosStore')

      const mascotas = useMascotaStore()
      const turnos = useMisTurnos()

      return Promise.all([
        mascotas.fetchByUserId(userId),
        turnos.fetchTurnos(userId)
      ])
    },
    clear: async () => {
      const { useMascotaStore } = await import('@/store/useMascotaStore')
      const { useMisTurnos } = await import('@/store/useMisTurnosStore')

      useMascotaStore().clearMascotas()
      useMisTurnos().clearTurnos()
    }
  },
  admin: {
    load: async () => {
      const { useMisTurnos } = await import('@/store/useMisTurnosStore')
      const { useTurnoStore } = await import('@/store/useTurnoStore')

      const turnos = useMisTurnos()
      const turnoStore = useTurnoStore()

      return Promise.all([
        turnos.fetchTurnosByFecha(),
        turnoStore.fetchVeterinarios()
      ])
    },
    clear: async () => {
      const { useMisTurnos } = await import('@/store/useMisTurnosStore')
      const { useTurnoStore } = await import('@/store/useTurnoStore')

      useMisTurnos().clearTurnos()
      useTurnoStore().resetTurno()
    }
  }
} as const

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Usuario | null,
    token: null as string | null
  }),

  actions: {
    async loadUserData() {
      if (!this.user?.id) return

      const config = USER_DATA_CONFIG[this.user.tipo as keyof typeof USER_DATA_CONFIG]
      if (config) {
        await config.load(this.user.id)
      }
    },

    async clearUserData() {
      if (!this.user) return

      const config = USER_DATA_CONFIG[this.user.tipo as keyof typeof USER_DATA_CONFIG]
      if (config) {
        await config.clear()
      }
    },

    setAuthToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    setUserFromResponse(data: AuthPayload) {
      this.user = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        tipo: data.tipo
      }
    },

    clearAuthState() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async login(email: string, password: string) {
      const data = await AuthService.login({ email, password })

      this.setUserFromResponse(data)
      this.setAuthToken(data.token)
      await this.loadUserData()
    },

    async registerClient(email: string, nombre: string, password: string) {
      const data = await AuthService.register({ email, nombre, password, tipo: "cliente" })

      this.setUserFromResponse(data)
      this.setAuthToken(data.token)
      await this.loadUserData()
    },

    async logout() {
      try {
        await AuthService.logout(this.token!)
      } catch (err) {
        console.warn('Error al hacer logout en backend:', err)
      } finally {
        await this.clearUserData()
        this.clearAuthState()
      }
    },

    async restoreSession() {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        // Decodificar JWT para obtener datos del usuario
        const payload = decodeJWT(token)
        if (!payload) {
          this.clearAuthState()
          return
        }

        // Verificar si el token expiró
        const now = Math.floor(Date.now() / 1000)
        if (payload.exp && payload.exp < now) {
          console.warn('Token expirado')
          this.clearAuthState()
          return
        }

        // Restaurar usuario desde el payload del token
        this.user = {
          id: payload.user_id,
          nombre: payload.nombre,
          email: payload.email,
          tipo: payload.tipo
        }

        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Cargar datos específicos del usuario
        await this.loadUserData()
      } catch (err) {
        console.warn('Error al restaurar sesión:', err)
        this.clearAuthState()
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token
  }
})

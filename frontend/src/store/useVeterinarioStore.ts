import { defineStore } from 'pinia'
import VeterinarioService from '@/services/VeterinarioService'
import type { Veterinario } from '@/types/Veterinario'

interface State {
  veterinarios: Veterinario[]
  veterinario: Veterinario | null,
  loading: boolean
  error: string | null
}

export const useVeterinarioStore = defineStore('veterinario', {
  state: (): State => ({
    veterinarios: [],
    veterinario: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchVeterinarios() {
      this.loading = true
      this.error = null

      try {
        const response = await VeterinarioService.getPublicList()
        this.veterinarios = response.data
      } catch (error: any) {
        this.error = 'Error al cargar veterinarios'
        console.error('VeterinarioStore: ', error)
      } finally {
        this.loading = false
      }
    },

    async fetchHorarios(veterinario_id: string) {
      this.loading = true
      try {
        const res = await VeterinarioService.getOne(Number(veterinario_id))
        this.veterinario = res.data
      } catch (e) {
        this.error = 'Error al cargar horarios'
        console.error(e)
        this.veterinario = null
      } finally {
        this.loading = false
      }
    },
    clearHorarios() {
      this.veterinario = null
    }
  }
})

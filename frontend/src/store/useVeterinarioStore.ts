// src/stores/useVeterinarioStore.ts
import { defineStore } from 'pinia'
import type { Veterinario } from '@/types/Veterinario'
import VeterinarioService from '@/services/VeterinarioService'

export const useVeterinarioStore = defineStore('veterinario', {
  state: () => ({
    veterinarios: [] as Veterinario[],
    loading: false
  }),
  actions: {
    async fetchVeterinarios() {
      this.loading = true
      try {
        const response = await VeterinarioService.getAll()
        this.veterinarios = response.data
      } catch (error) {
        console.error('Error al obtener veterinarios', error)
      } finally {
        this.loading = false
      }
    }
  }
})

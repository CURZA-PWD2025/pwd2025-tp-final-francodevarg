import { defineStore } from 'pinia'
import VeterinarioService from '@/services/VeterinarioService'
import type { Veterinario } from '@/types/Veterinario'

interface HorarioDisponible {
  hora: string
  disponible: boolean
}

interface State {
  veterinarios: Veterinario[]
  veterinario: Veterinario | null
  loading: boolean
  error: string | null
  horariosDisponibles: HorarioDisponible[]
}

export const useVeterinarioStore = defineStore('veterinario', {
  state: (): State => ({
    veterinarios: [],
    veterinario: null,
    loading: false,
    error: null,
    horariosDisponibles: []
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

    async fetchDisponibilidad(veterinario_id: number, fechaISO: string) {
      this.loading = true
      this.error = null
      try {
        const res = await VeterinarioService.getDisponibilidad(veterinario_id, fechaISO)
        this.horariosDisponibles = res.data // ← array [{hora, disponible}]
      } catch (e) {
        this.error = 'Error al cargar disponibilidad'
        console.error('fetchDisponibilidad:', e)
        this.horariosDisponibles = []
      } finally {
        this.loading = false
      }
    },
    setVeterinario(v: Veterinario | null) {
      console.log("v",v)
      this.veterinario = v
    },
    clearHorarios() {
      this.horariosDisponibles = []
    }
  }
})


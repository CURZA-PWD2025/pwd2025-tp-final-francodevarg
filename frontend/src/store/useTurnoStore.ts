import { defineStore } from 'pinia'
import type { Turno } from '@/types/Turno'
import type { Veterinario } from '@/types/Veterinario'
import TurnoService from '@/services/TurnoService'
import VeterinarioService from '@/services/VeterinarioService'

interface HorarioDisponible {
  hora: string
  disponible: boolean
}

const initialTurno: Turno = {
  veterinario_id: null,
  mascota_id: null,
  fecha: '',
  hora: '',
  motivo: '',
  estado: 'pendiente'
}

export const useTurnoStore = defineStore('turno', {
  state: () => ({
    turno: { ...initialTurno } as Turno,
    veterinarios: [] as Veterinario[],
    veterinario: null as Veterinario | null,
    horariosDisponibles: [] as HorarioDisponible[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    diasHabilitados(state): number[] {
      if (!state.veterinario) return []

      const diasMap: Record<string, number> = {
        Domingo: 0,
        Lunes: 1,
        Martes: 2,
        Miércoles: 3,
        Jueves: 4,
        Viernes: 5,
        Sábado: 6
      }

      return Array.from(
        new Set(state.veterinario.horarios.map(h => diasMap[h.dia_semana]))
      )
    }
  },

  actions: {
    setTurnoDatos(datos: Partial<Turno>) {
      this.turno = { ...this.turno, ...datos }
    },

    resetTurno() {
      this.turno = { ...initialTurno }
    },

    async finish() {
      try {
        console.log('📤 Enviando payload final:', this.turno)
        const { data } = await TurnoService.create(this.turno)
        console.log('✅ Turno creado:', data)
        this.resetTurno()
        return data
      } catch (err) {
        console.error('❌ Error al crear turno:', err)
        throw err
      }
    },

    // === Veterinarios ===
    async fetchVeterinarios() {
      this.loading = true
      this.error = null
      try {
        const response = await VeterinarioService.getPublicList()
        this.veterinarios = response.data
      } catch (error: any) {
        this.error = 'Error al cargar veterinarios'
        console.error('TurnoStore (veterinarios): ', error)
      } finally {
        this.loading = false
      }
    },

    setVeterinarioById(id: number | null) {
      if (!id) {
        this.veterinario = null
        this.clearHorarios()
        return
      }

      const seleccionado = this.veterinarios.find(v => v.id === id)
      this.veterinario = seleccionado || null
      this.clearHorarios()
    },

    clearHorarios() {
      this.horariosDisponibles = []
    },

    async fetchDisponibilidad(veterinarioId: number, fechaISO: string) {
      try {
        const { data } = await VeterinarioService.getDisponibilidad(veterinarioId, fechaISO)
        this.horariosDisponibles = data || []
      } catch (error: any) {
        this.error = 'Error al obtener disponibilidad'
        console.error('TurnoStore (disponibilidad): ', error)
      }
    }
  }
})

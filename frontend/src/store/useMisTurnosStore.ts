import { defineStore } from 'pinia'
import type { TurnoDetail, EstadoTurno } from '@/types/Turno'
import TurnoService from '@/services/TurnoService'

export const useMisTurnos = defineStore('misTurnos', {
  state: () => ({
    turnos: [] as TurnoDetail[],
    filtroEstado: 'todos' as 'todos' | EstadoTurno,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    turnosFiltrados(state): TurnoDetail[] {
      if (state.filtroEstado === 'todos') return state.turnos
      return state.turnos.filter((t:TurnoDetail) => t.estado === state.filtroEstado)
    },
    total(state): number {
      return state.turnos.length
    },
    confirmados(state): TurnoDetail[] {
      return state.turnos.filter((t:TurnoDetail) => t.estado === 'confirmado')
    },
    pendientes(state): TurnoDetail[] {
      return state.turnos.filter((t:TurnoDetail) => t.estado === 'pendiente')
    },
    cancelados(state): TurnoDetail[] {
      return state.turnos.filter((t:TurnoDetail) => t.estado === 'cancelado')
    },
  },

  actions: {
    setFiltro(estado: 'todos' | EstadoTurno) {
      this.filtroEstado = estado
    },

    async fetchTurnos(userId: number) {
      this.loading = true
      this.error = null
      try {
        const data = await TurnoService.getByUserId(userId)
        this.turnos = data
      } catch (err: any) {
        this.error = err.message || 'Error cargando turnos'
      } finally {
        this.loading = false
      }
    },
  },
})

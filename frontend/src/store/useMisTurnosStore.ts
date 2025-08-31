import { defineStore } from 'pinia'
import type { Turno, EstadoTurno } from '@/types/Turno'

export const useMisTurnos = defineStore('misTurnos', {
  state: () => ({
    turnos: [] as Turno[],
    filtroEstado: 'todos' as 'todos' | EstadoTurno
  }),
  getters: {
    turnosFiltrados(state): Turno[] {
      if (state.filtroEstado === 'todos') return state.turnos
      return state.turnos.filter(t => t.estado === state.filtroEstado)
    },
  },
  actions: {
    // mock: traería desde tu API Flask /turnos del cliente autenticado
    cargarMock() {
      this.turnos = [
        {
          id: 1,
          veterinario_id:1,
          mascota_id:1,
          hora:"11:00",
          fecha: '2025-01-19T10:00:00',
          motivo: 'Control de rutina',
          estado: 'confirmado'
        },
        {
          id: 2,
          veterinario_id:1,
          mascota_id:1,
          hora:"11:00",
          fecha: '2025-01-24T15:00:00',
          motivo: 'Revisión de tratamiento para alergia, inyeccion de corticoides, receta de un nuevo farmaco',
          estado: 'pendiente'
        },
        {
          id: 3,
          veterinario_id:1,
          mascota_id:1,
          hora:"11:00",
          fecha: '2025-01-14T09:00:00',
          motivo: 'Refuerzo anual',
          estado: 'cancelado'
        }
      ]
    },
    setFiltro(estado: 'todos' | EstadoTurno) {
      this.filtroEstado = estado
    },
    async cancelarTurno(id: number) {
      const t = this.turnos.find(x => x.id === id)
      if (t) t.estado = 'cancelado'
    },
    async reprogramarTurno(id: number) {
      console.log('Reprogramar turno', id)
    }
  }
})

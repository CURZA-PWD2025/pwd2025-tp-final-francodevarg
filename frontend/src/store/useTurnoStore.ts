import { defineStore } from 'pinia'

interface TurnoData {
  veterinario_id?: number
  fecha?: string
  hora?: string
  paciente?: {
    nombre: string
    email: string
    telefono: string
  }
  estado?: string
}

export const useTurnoStore = defineStore('turno', {
  state: (): { turno: TurnoData } => ({
    turno: {},
  }),
  actions: {
    setTurnoDatos(datos: Partial<TurnoData>) {
      this.turno = { ...this.turno, ...datos }
    },
    setPaciente(datos: TurnoData['paciente']) {
      this.turno.paciente = datos
    },
    resetTurno() {
      this.turno = {}
    },
  },
})

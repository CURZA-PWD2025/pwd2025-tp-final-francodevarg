import type { Turno } from '@/types/Turno'
import { defineStore } from 'pinia'
import TurnoService from '@/services/TurnoService'

export const useTurnoStore = defineStore('turno', {
  state: (): { turno: Turno} => ({
    turno: {}
  }),
  actions: {
    setTurnoDatos(datos: Partial<Turno>) {
      this.turno = { ...this.turno, ...datos }
    },
    resetTurno() {
      this.turno = {}
    },
    async finish() {
      try {
        console.log('Enviando payload final:', this.turno)
        const { data } = await TurnoService.create(this.turno)
        console.log('✅ Turno creado:', data)
        this.resetTurno()
        return data
      } catch (err) {
        console.error('❌ Error al crear turno:', err)
        throw err
      }
    }
  },
})

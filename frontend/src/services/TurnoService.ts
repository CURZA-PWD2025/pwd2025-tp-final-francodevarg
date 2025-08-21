import ApiService from './ApiService'
import type { Turno } from '../types/Turno'

const baseUrl = 'turnos/'

export default {
  // Privados (requieren autenticación)
  getAll() {
    return ApiService.getAll<Turno>(baseUrl, true)
  },

  create(data: Partial<Turno>) {
    return ApiService.create<Turno>(baseUrl, data, true)
  },

  update(id: number, data: Partial<Turno>) {
    return ApiService.update<Turno>(baseUrl, id, data, true)
  },

  destroy(id: number) {
    return ApiService.destroy(baseUrl, id, true)
  },
}

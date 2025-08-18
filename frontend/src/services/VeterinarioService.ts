import ApiService from './ApiService'
import type { Veterinario } from '../types/Veterinario'

const baseUrl = 'veterinarios/'
interface HorarioDisponible {
  hora: string
  disponible: boolean
}
export default {
  // Público
  getPublicList() {
    return ApiService.getAll<Veterinario>(baseUrl, false)
  },
  
  getDisponibilidad(veterinario_id: number, fecha: string) {
    return ApiService.getAll<HorarioDisponible>(`/veterinarios/disponibilidad?veterinario_id=${veterinario_id}&fecha=${fecha}`,false)
  },

  getOne(id: number) {
    return ApiService.getOne<Veterinario>(baseUrl, id, false)
  },

  // Privados (requieren autenticación)
  getAll() {
    return ApiService.getAll<Veterinario>(baseUrl, true)
  },


  create(data: Partial<Veterinario>) {
    return ApiService.create<Veterinario>(baseUrl, data, true)
  },

  update(id: number, data: Partial<Veterinario>) {
    return ApiService.update<Veterinario>(baseUrl, id, data, true)
  },

  destroy(id: number) {
    return ApiService.destroy(baseUrl, id, true)
  },
}

import type { AxiosResponse } from 'axios'
import ApiService from './ApiService'
import type { Turno, TurnoDetail } from '@/types/Turno'

const baseUrl = 'turnos/'

export default {
  // Obtener turnos de un usuario (con mascota + veterinario incluidos)
  async getByUserId(userId: number): Promise<TurnoDetail[]> {
    const res: AxiosResponse<TurnoDetail[]> = await ApiService.getAll<TurnoDetail>(
      `${baseUrl}usuario/${userId}`,
      true
    )
    return res.data
  },

  async getByFechaHoy(): Promise<TurnoDetail[]> {
    const hoy = new Date()
    const fecha = hoy.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) // DD/MM/YYYY

    // si tu backend espera DD-MM-YYYY, reemplazamos las barras
    const fechaParam = fecha.replace(/\//g, "-")

    const res: AxiosResponse<TurnoDetail[]> = await ApiService.getAll<TurnoDetail>(
      `${baseUrl}fecha/${fechaParam}`,
      true
    )
    return res.data
  },

  create(data: Partial<Turno>) {
    return ApiService.create<Turno>(baseUrl, data, true)
  },

  update(id: number, data: Partial<Turno>) {
    return ApiService.update<Turno>(baseUrl, id, data, true)
  },

  confirm(id: number) {
    return ApiService.update<Turno>(`${baseUrl}confirmar/`, id, {}, true)
  },

  complete(id: number) {
    return ApiService.update<Turno>(`${baseUrl}completar/`, id, {}, true)
  },

  cancel(id: number) {
    return ApiService.update<Turno>(`${baseUrl}cancelar/`, id, {}, true)
  }
}

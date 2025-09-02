import ApiService from "@/services/ApiService"
import type { AxiosResponse } from "axios"
import type { Mascota } from "@/types/Mascota"

class MascotaService {
  private baseUrl = "mascotas/"

  // Obtener mascotas de un usuario
  async getByUserId(userId: number): Promise<Mascota[]> {
    const res: AxiosResponse<Mascota[]> = await ApiService.getAll<Mascota>(
      `${this.baseUrl}usuario/${userId}`
    )
    return res.data
  }

  // Crear mascota
  async create(data: Partial<Mascota>): Promise<Mascota> {
    const res = await ApiService.create<Mascota>(this.baseUrl, data, true)
    return res.data
  }

  // Actualizar mascota
  async update(id: number, data: Partial<Mascota>): Promise<Mascota> {
    const res = await ApiService.update<Mascota>(this.baseUrl, id, data, true)
    return res.data
  }

  // Eliminar mascota
  async destroy(id: number): Promise<void> {
    await ApiService.destroy(this.baseUrl, id, true)
  }
}

export default new MascotaService()

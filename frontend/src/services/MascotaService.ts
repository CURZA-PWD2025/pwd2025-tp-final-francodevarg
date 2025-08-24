import ApiService from "@/services/ApiService"
import type { AxiosResponse } from "axios"
import type { Mascota } from "@/types/Mascota"

class MascotaService {
  private baseUrl = "/mascotas/"

  async getByUserId(userId: number): Promise<AxiosResponse<Mascota[]>> {
    return ApiService.getAll<Mascota>(`${this.baseUrl}usuario/${userId}`)
  }
}

export default new MascotaService()

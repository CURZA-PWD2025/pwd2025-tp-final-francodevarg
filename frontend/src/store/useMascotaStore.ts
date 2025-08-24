import { defineStore } from "pinia"
import MascotaService from "@/services/MascotaService"
import type { Mascota } from "@/types/Mascota"

export const useMascotaStore = defineStore("mascotas", {
  state: (): { mascotas: Mascota[] } => ({
    mascotas: [],
  }),
  actions: {
    async fetchMascotas(userId: number) {
      if (this.mascotas.length > 0) return this.mascotas

      const { data } = await MascotaService.getByUserId(userId)
      this.mascotas = data
      return data
    },
    clearMascotas() {
      this.mascotas = []
    },
  },
})

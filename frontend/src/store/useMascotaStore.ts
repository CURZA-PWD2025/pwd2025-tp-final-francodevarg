import { defineStore } from "pinia"
import type { Mascota } from "@/types/Mascota"
import MascotaService from "@/services/MascotaService"

interface State {
  items: Mascota[]
  loading: boolean
  error: string | null
}

export const useMascotaStore = defineStore("mascotas", {
  state: (): State => ({
    items: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchByUserId(userId: number) {
      console.log("number",userId)
      this.loading = true
      this.error = null
      try {
        this.items = await MascotaService.getByUserId(userId)
      } catch (e: any) {
        this.error = e?.message ?? "Error cargando mascotas"
      } finally {
        this.loading = false
      }
    },

    async createOne(payload: Partial<Mascota>) {
      try {
        const data = await MascotaService.create(payload)
        console.log("datastore",data)
        this.items.push(data as Mascota)
        return data
      } catch (e: any) {
        this.error = e?.message ?? "Error creando mascota"
        throw e
      }
    },

    async updateOne(id: number, payload: Partial<Mascota>) {
      try {
        await MascotaService.update(id, payload)
        const idx = this.items.findIndex(m => m.id === id)
        if (idx !== -1) this.items[idx] = payload as Mascota
        return payload
      } catch (e: any) {
        this.error = e?.message ?? "Error actualizando mascota"
        throw e
      }
    },

    async removeOne(id: number) {
      try {
        await MascotaService.destroy(id)
        console.log("eliminado",id)
        this.items = this.items.filter(m => m.id !== id)
      } catch (e: any) {
        console.log("eliminado",e)
        this.error = e?.message ?? "Error eliminando mascota"
        throw e
      }
    },

    async clearMascotas(){
      this.items = []
    }
  },
})

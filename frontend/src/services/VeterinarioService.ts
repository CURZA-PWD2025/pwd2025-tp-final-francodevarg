import ApiService from './ApiService'
import type { Veterinario } from '../types/Veterinario'

const baseUrl = 'veterinarios/'

export default {
  getAll() {
    return ApiService.getAll<Veterinario>(baseUrl)
  },
  getOne(id: number) {
    return ApiService.getOne<Veterinario>(baseUrl, id)
  },
}
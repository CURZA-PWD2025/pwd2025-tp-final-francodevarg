import type { Usuario } from './Usuario'

export interface Mascota {
  id?: number               // opcional al crear una nueva
  nombre: string
  especie: string           
  raza: string           
  edad: number
  usuario_id: number   
}

export interface MascotaDetail extends Mascota {
  usuario: Usuario          // detalle completo del dueño
}
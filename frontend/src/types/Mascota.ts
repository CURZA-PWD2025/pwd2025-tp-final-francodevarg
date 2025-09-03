import type { Usuario } from './Usuario'

export interface Mascota {
  id?: number               // opcional al crear una nueva
  nombre: string
  especie: string           // ej: "Perro", "Gato"
  raza: string              // ej: "Labrador", "Siames"
  edad: number
  usuario_id: number        // referencia al dueño (cliente)
}

export interface MascotaDetail extends Mascota {
  usuario: Usuario          // detalle completo del dueño
}
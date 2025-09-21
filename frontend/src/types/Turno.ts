export type EstadoTurno = 'Pendiente' | 'Confirmado' | 'Cancelado'

export interface Turno {
  id?: number
  veterinario_id: number | null
  mascota_id: number | null
  fecha: string
  hora: string
  motivo: string
  estado: EstadoTurno,
  created_at?: string
}

import type { Veterinario } from './Veterinario'
import type { Mascota } from './Mascota'

export interface TurnoDetail extends Turno {
  veterinario: Veterinario
  mascota: Mascota
}

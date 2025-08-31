export type EstadoTurno = 'pendiente' | 'confirmado' | 'cancelado'

export interface Turno {
  id?: number
  veterinario_id: number | null
  mascota_id: number | null
  fecha: string
  hora: string
  motivo: string
  estado: EstadoTurno
}

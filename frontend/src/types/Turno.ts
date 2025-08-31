export type EstadoTurno = 'pendiente' | 'confirmado' | 'cancelado'

export interface Turno {
  veterinario_id: number | null
  mascota_id: number | null
  fecha: string
  hora: string
  motivo: string
  estado: EstadoTurno
}

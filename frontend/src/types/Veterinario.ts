import type { DiaSemana, Hora } from '@/constants/diasSemana'

export interface Horario {
  id: number
  dia_semana: DiaSemana
  hora: Hora
  disponible?: boolean
}

export interface HorarioDisponible extends Horario {
  disponible: boolean
}

export interface Veterinario {
  id: number
  nombre: string
  especialidad: string
  email: string
  telefono: string
  horarios: Horario[]
}
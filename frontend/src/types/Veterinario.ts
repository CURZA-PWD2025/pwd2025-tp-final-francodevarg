export interface Horario {
  id: number
  dia_semana: string
  hora: string // formato "HH:MM"
}

export interface Veterinario {
  id: number
  nombre: string
  especialidad: string
  email: string
  telefono: string
  horarios: Horario[]
}
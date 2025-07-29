export function normalizarHora(hora: string): string {
  // Convierte '08:00:00' -> '08:00', deja '08:00' igual
  return hora?.length === 8 ? hora.slice(0, 5) : hora
}

import { horariosDisponibles, type Horario } from '@/constants/diasSemana'

export function filtrarHorariosValidos(arr: string[]): Horario[] {
  return arr
    .map(normalizarHora)
    .filter((h): h is Horario => horariosDisponibles.includes(h as Horario))
}
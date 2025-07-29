export function normalizarHora(hora: string): string {
  // Asegura siempre HH:MM
  const [h, m] = hora.split(':')
  const hh = h.padStart(2, '0')
  return `${hh}:${m}`
}

import { horariosDisponibles, type Horario } from '@/constants/diasSemana'

export function filtrarHorariosValidos(arr: string[]): Horario[] {
  return arr
    .map(normalizarHora)
    .filter((h): h is Horario => horariosDisponibles.includes(h as Horario))
}
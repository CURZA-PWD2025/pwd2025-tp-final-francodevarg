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

export function formatFechaHora(iso: string): { fecha: string; hora: string } {
  const d = new Date(iso)
  const fecha = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const hora  = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
  return { fecha, hora }
}

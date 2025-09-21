export const diasSemana = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const

export type DiaSemana = typeof diasSemana[number]

export const horariosDisponibles = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
] as const

export type Hora = typeof horariosDisponibles[number]

export const diasSemanaConLabel = diasSemana.map(dia => ({
  id: dia,
  label: dia.slice(0, 3),
}))
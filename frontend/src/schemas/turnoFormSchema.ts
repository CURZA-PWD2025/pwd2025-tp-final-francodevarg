import { z } from 'zod'
import type { DateValue } from '@internationalized/date'

export const makeTurnoFormSchema = (horasDisponibles: string[]) =>
  z.object({
    veterinario_id: z.string().min(1, 'Selecciona un veterinario'),

    fecha: z.any().refine(
      (val): val is DateValue =>
        typeof val === 'object' && val !== null && 'toDate' in val,
      { message: 'La fecha es obligatoria' }
    ),

    hora: z.string()
      .min(1, 'Selecciona un horario')
      .refine(h => horasDisponibles.includes(h), {
        message: 'Selecciona un horario válido para esta fecha'
      })
  })

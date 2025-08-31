import { z } from 'zod'
import type { DateValue } from '@internationalized/date'

export const makeTurnoFormSchema = () =>
  z.object({
    veterinario_id: z.string()
      .min(1, 'Selecciona un veterinario'),

    mascota_id: z.string()
      .min(1, 'Selecciona una mascota'),

    fecha: z.any().refine(
      (val): val is DateValue =>
        typeof val === 'object' &&
        val !== null &&
        typeof val.toDate === 'function',
      { message: 'La fecha es obligatoria' }
    ),

    hora: z.string()
      .min(1, 'Selecciona un horario'),

    motivo: z.string()
      .min(1, 'El motivo es obligatorio'),

    estado: z.enum(['pendiente', 'confirmado', 'cancelado'], {
      required_error: 'El estado es requerido',
      invalid_type_error: 'El estado no es válido'
    })
  })

import { z } from 'zod'
import type { DateValue } from '@internationalized/date'

export const makeTurnoFormSchema = () =>
  z.object({
    veterinario_id: z.preprocess(
      (val) => Number(val),
      z.number().min(1, 'Seleccioná un veterinario')
    ),
    mascota_id: z.preprocess(
      (val) => Number(val),
      z.number().min(1, 'Seleccioná una mascota')
    ),
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

    estado: z.enum(['Pendiente', 'Confirmado', 'Cancelado'], {
      required_error: 'El estado es requerido',
      invalid_type_error: 'El estado no es válido'
    })
  })

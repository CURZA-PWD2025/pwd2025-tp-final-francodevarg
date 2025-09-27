import { z } from 'zod'
import type { DateValue } from '@internationalized/date'


const toSafeNumber = (v: unknown) => {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(v as any);
  return Number.isFinite(n) ? n : 0;
};


export const makeTurnoFormSchema = () =>
  z.object({
    veterinario_id: z.preprocess(
      toSafeNumber,
      z.number().int().min(1, { message: "Debe seleccionar un veterinario" })
    ),
    mascota_id: z.preprocess(
      toSafeNumber,
      z.number().int().min(1, { message: "Debe seleccionar una mascota" })
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

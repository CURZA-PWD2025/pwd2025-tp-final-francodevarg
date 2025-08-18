import { z } from 'zod'
import type { DateValue } from '@internationalized/date'

export const turnoFormSchema = z.object({
  veterinario_id: z.string().min(1, 'Selecciona un veterinario'),
  fecha: z.any().refine(
    (val): val is DateValue =>
      typeof val === 'object' && val !== null && 'toDate' in val,
    { message: 'La fecha es obligatoria' }
  ),
})

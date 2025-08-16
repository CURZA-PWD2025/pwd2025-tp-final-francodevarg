import { z } from 'zod'
import type { DateValue } from '@internationalized/date'

export const turnoFormSchema = z.object({
  veterinario_id: z.string().min(1, 'Selecciona un veterinario'),
  fecha: z.custom<DateValue>((val) => val === undefined, {
    message: 'La fecha es obligatoria',
  }),
  hora: z.string().min(1, 'La hora es obligatoria'),
})

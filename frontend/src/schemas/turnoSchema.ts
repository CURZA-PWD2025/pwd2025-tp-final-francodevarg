import { z } from 'zod'

export const formSchemaTurno = z.object({
  veterinario_id: z.string().min(1, 'Selecciona un veterinario'),
  fecha: z.date({ required_error: 'Selecciona una fecha' }),
})

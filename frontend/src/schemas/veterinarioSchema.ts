import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { diasSemana, horariosDisponibles } from '@/constants/diasSemana'

export const formSchema = toTypedSchema(z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  especialidad: z.string().min(1, 'La especialidad es obligatoria'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  dias: z.array(z.enum(diasSemana)),
  horarios: z.array(z.enum(horariosDisponibles)),
}))

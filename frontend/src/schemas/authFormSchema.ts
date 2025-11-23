
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
})

export const registerSchema = loginSchema.extend({
    nombre: z.string().min(1, 'Nombre requerido'),
    passwordConfirm: z.string().min(4, 'Confirmación requerida')
}).refine((data: any) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm']
})

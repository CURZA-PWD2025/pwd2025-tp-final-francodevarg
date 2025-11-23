import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/useAuthStore'
import type { AuthFormValues } from '@/types/Auth'

export function useAuthForm(emit: (event: 'success', user: any) => void) {
  const authStore = useAuthStore()
  const mode = ref<'login' | 'register'>('login')
  const backendError = ref<string | null>(null)

  const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
  })

  const registerSchema = loginSchema.extend({
    nombre: z.string().min(1, 'Nombre requerido'),
    passwordConfirm: z.string().min(4, 'Confirmación requerida')
  }).refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm']
  })

  const schema = computed(() =>
    mode.value === 'login'
      ? toTypedSchema(loginSchema)
      : toTypedSchema(registerSchema)
  )

  const initialValues: AuthFormValues = {
    nombre: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }

  const { handleSubmit, errors, values, resetForm } = useForm<AuthFormValues>({
    validationSchema: schema,
    initialValues,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true
  })

  // Submit
  const onSubmit = handleSubmit(async (formValues) => {
    backendError.value = null
    try {
      if (mode.value === 'login') {
        await authStore.login(formValues.email, formValues.password)
      } else { // mode.value === 'register'
        //Solo registro usuarios tipo clientes
        await authStore.register(
          formValues.email,
          formValues.nombre,
          formValues.password,
          'cliente'
        )
      }
      emit('success', authStore.user)
      resetForm({ values: initialValues })
    } catch (err: any) {
      console.log("err", err)
      if (err?.response?.data?.mensaje) {
        backendError.value = err.response.data.mensaje
      } else {
        backendError.value = 'Ocurrió un error inesperado. Intentalo más tarde.'
      }
    }
  })


  const isFormValid = computed(() => Object.keys(errors.value).length === 0)

  function toggleMode() {
    mode.value = mode.value === 'login' ? 'register' : 'login'
    resetForm({ values: initialValues })
  }

  return {
    mode,
    values,
    errors,
    backendError,
    isFormValid,
    onSubmit,
    toggleMode
  }
}

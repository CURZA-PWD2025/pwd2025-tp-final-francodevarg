import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/store/useAuthStore'
import type { AuthFormData, AuthMode } from '@/types/Auth'
import type { Usuario } from '@/types/Usuario'
import { loginSchema, registerSchema } from '@/schemas/authFormSchema'
import { AxiosError } from 'axios'

export function useAuthForm(emit: (event: 'success', user: Usuario | null) => void) {
  const authStore = useAuthStore()
  const selectedSchema = ref<AuthMode>('login')
  const backendError = ref<string | null>(null)

  const initialValues: AuthFormData = {
    nombre: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }

  const currentSchema = computed(() => getSchema(selectedSchema.value))
  const { handleSubmit, errors, values, resetForm } = useForm<AuthFormData>({
    validationSchema: currentSchema,
    initialValues
  })

  function getSchema(mode: AuthMode) {
    return mode === 'login' ? toTypedSchema(loginSchema) : toTypedSchema(registerSchema)
  }

  function handleBackendError(error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.mensaje) {
      backendError.value = error.response.data.mensaje
    } else {
      backendError.value = 'Ocurrió un error inesperado. Intenta más tarde.'
    }
  }

  const onSubmit = handleSubmit(async (formValues) => {
    backendError.value = null
    try {
      if (selectedSchema.value === 'login') {
        await authStore.login(formValues.email, formValues.password)
      } else {
        await authStore.registerClient(formValues.email, formValues.nombre, formValues.password)
      }
      emit('success', authStore.getUser)
      resetForm({ values: initialValues })
    } catch (err) {
      handleBackendError(err)
    }
  })

  const isFormValid = computed(() => Object.keys(errors.value).length === 0)

  function toggleMode() {
    selectedSchema.value = selectedSchema.value === 'login' ? 'register' : 'login'
    resetForm({ values: initialValues })
  }

  return {
    selectedSchema,
    values,
    errors,
    backendError,
    isFormValid,
    onSubmit,
    toggleMode
  }
}
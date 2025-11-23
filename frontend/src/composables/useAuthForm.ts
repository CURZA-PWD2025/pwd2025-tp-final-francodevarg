import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/store/useAuthStore'
import type { AuthFormValues } from '@/types/Auth'
import { loginSchema, registerSchema } from '@/schemas/authFormSchema'

export function useAuthForm(emit: (event: 'success', user: any) => void) {
  const authStore = useAuthStore()
  const selectedSchema = ref<'login' | 'register'>('login')
  const backendError = ref<string | null>(null)

  //Selected by User
  const currentSchema = computed(() =>
    selectedSchema.value === 'login'
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
    validationSchema: currentSchema,
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
      if (selectedSchema.value === 'login') {
        await authStore.login(formValues.email, formValues.password)
      } else { // selectedSchema.value === 'register'
        //Solo registro usuarios tipo clientes
        await authStore.registerClient(
          formValues.email,
          formValues.nombre,
          formValues.password
        )
      }
      emit('success', authStore.getUser)
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

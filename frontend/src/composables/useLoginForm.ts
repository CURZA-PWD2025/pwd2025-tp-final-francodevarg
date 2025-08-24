import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'
import type { LoginCredentials, LoginFormData, LoginFormErrors } from '@/types/Auth'

export function useLoginForm() {
  // Store
  const authStore = useAuthStore()

  // Reactive state
  const formData = ref<LoginFormData>({
    email: '',
    password: ''
  })

  const errors = ref<LoginFormErrors>({})
  const isLoading = ref(false)
  const loginError = ref<string | null>(null)

  const isFormValid = computed(() => {
    const email = (formData.value.email || '').trim()
    const password = (formData.value.password || '').trim()
    const hasErrors = !!errors.value.email || !!errors.value.password

    return email.length > 0 && password.length > 0 && !hasErrors
  })

  // Validation rules
  const validateEmail = (email: string): string | null => {
    if (!email) return 'El email es requerido'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Formato de email inválido'
    
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return 'La contraseña es requerida'
    if (password.length < 3) return 'La contraseña debe tener al menos 3 caracteres'
    
    return null
  }

  const validateField = (field: keyof LoginFormErrors) => {
    const value = formData.value[field] || ''
    let error: string | null = null

    if (field === 'email') error = validateEmail(value)
    if (field === 'password') error = validatePassword(value)

    if (error) {
      errors.value[field] = error
    } else {
      delete errors.value[field]
    }
  }

  // Validación reactiva por campo
  watch(() => formData.value.email, () => validateField('email'))
  watch(() => formData.value.password, () => validateField('password'))

  // Methods
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {}

    // Validate email
    const emailError = validateEmail(formData.value.email)
    if (emailError) newErrors.email = emailError

    // Validate password
    const passwordError = validatePassword(formData.value.password)
    if (passwordError) newErrors.password = passwordError

    errors.value = newErrors
    loginError.value = null

    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    formData.value = {
      email: '',
      password: ''
    }
    errors.value = {}
    loginError.value = null
    isLoading.value = false
  }

  const submitLogin = async (credentials: LoginCredentials) => {
    isLoading.value = true
    loginError.value = null

    try {
      const user = await authStore.login(credentials.email, credentials.password)
      return user
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'INVALID_CREDENTIALS':
            loginError.value = 'Email o contraseña incorrectos'
            break
          default:
            loginError.value = error.message || 'Error al iniciar sesión'
        }
      } else {
        loginError.value = 'Error desconocido al iniciar sesión'
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearFieldError = (field: keyof LoginFormErrors) => {
    if (errors.value[field]) {
      delete errors.value[field]
      errors.value = { ...errors.value }
    }
  }

  return {
    // State
    formData,
    errors,
    isLoading,
    loginError,
    
    // Computed
    isFormValid,
    
    // Methods
    validateForm,
    resetForm,
    submitLogin,
    clearFieldError,
    validateEmail,
    validatePassword
  }
}

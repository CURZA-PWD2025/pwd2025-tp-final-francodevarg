export interface AuthResponse {
  id: number
  nombre: string
  email: string
  tipo: 'admin' | 'cliente'
  token: string
}

export interface AuthFormValues {
  nombre: string
  email: string
  password: string
  passwordConfirm: string
}

export interface AuthPayload {
  id: number
  nombre: string
  email: string
  tipo: UserRole
  token: string
}

export interface AuthFormData {
  nombre: string
  email: string
  password: string
  passwordConfirm: string
}

export type UserRole = 'admin' | 'cliente'

export type AuthMode = 'login' | 'register'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  nombre: string
  password: string
  tipo: 'cliente'
}

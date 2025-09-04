export interface AuthResponse {
  id: number
  nombre: string
  email: string
  tipo: 'admin' | 'cliente'
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  nombre: string
  password: string
  tipo?: 'cliente' | 'admin'
}

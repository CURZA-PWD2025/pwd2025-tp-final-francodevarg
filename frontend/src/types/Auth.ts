// Auth related types
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface LoginFormErrors {
  email?: string
  password?: string
}

export interface User {
  id: string
  email: string
  name?: string
  role?: string
  avatar?: string
  permissions?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// API Response types
export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

// Store actions return types
export type LoginResult = User | null
export type LogoutResult = void

// Form validation types
export type ValidationRule<T = string> = (value: T) => string | null
export type FormValidator = () => boolean
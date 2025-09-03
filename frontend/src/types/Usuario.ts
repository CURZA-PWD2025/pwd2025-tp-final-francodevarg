export interface Usuario {
  id: number
  nombre: string
  email: string
  password: string
  tipo: 'admin' | 'cliente'
}

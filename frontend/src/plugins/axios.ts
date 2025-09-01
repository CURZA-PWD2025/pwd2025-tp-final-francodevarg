import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 10000,
})

// Normaliza headers a AxiosHeaders SIEMPRE
function ensureHeaders(config: InternalAxiosRequestConfig) {
  if (!config.headers) config.headers = new AxiosHeaders()
  else if (!(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers as any)
  }
  return config.headers as AxiosHeaders
}

instance.interceptors.request.use((config) => {
  const headers = ensureHeaders(config)

  // Si el caller no pidió saltar auth…
  const skip = headers.has('skip-authorization') // usar lowercase SIEMPRE
  if (!skip) {
    const auth = useAuthStore()
    const token = auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  } else {
    headers.delete('skip-authorization') // que no viaje al backend
  }

  // Agregamos un header de debug para asegurarnos que ESTA instancia se usa
  headers.set('X-Debug-Client', 'axios-instance')

  // LOG: cómo va a salir la request (lo vas a ver en la consola del navegador)
  const dump = (headers.toJSON?.() ?? headers) as Record<string, any>
  console.debug('[axios] outgoing headers', dump)

  return config
})

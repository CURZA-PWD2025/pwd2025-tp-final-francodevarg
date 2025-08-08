import axios from 'axios'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
})

// Interceptor para añadir Bearer Token si no se indica "Skip-Authorization"
instance.interceptors.request.use((config) => {
  const shouldSkipAuth = config.headers?.['Skip-Authorization']

  if (!shouldSkipAuth) {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } else {
    delete config.headers['Skip-Authorization']
  }

  return config
})

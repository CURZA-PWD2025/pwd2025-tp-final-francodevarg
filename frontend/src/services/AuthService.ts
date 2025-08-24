import { instance as axios } from '@/plugins/axios'
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/Auth'
import type { AxiosResponse } from 'axios'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return (await axios.post('/auth/login', credentials)).data
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>('/auth/register', credentials)
    return data
  }

  async logout(): Promise<AxiosResponse<{ message: string }>>{
    return await axios.post('/auth/logout')
  }

  async profile(): Promise<User> {
    const { data } = await axios.get<User>('/auth/profile')
    return data
  }

}

export default new AuthService()

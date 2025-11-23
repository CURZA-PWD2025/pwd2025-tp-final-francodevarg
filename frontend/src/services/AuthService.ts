import { instance as axios } from '@/plugins/axios'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/Auth'
import type { Usuario } from '@/types/Usuario'
import type { AxiosResponse } from 'axios'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return (await axios.post('auth/login', credentials)).data
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>('auth/register', credentials)
    return data
  }

  async logout(token: string): Promise<AxiosResponse<{ message: string }>> {
    return await axios.post('auth/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  // async profile(): Promise<Usuario> {
  //   const { data } = await axios.get<Usuario>('auth/profile', {
  //     headers: {
  //       Authorization: `Bearer ${this.token}`
  //     }
  //   })
  //   return data
  // }

}

export default new AuthService()

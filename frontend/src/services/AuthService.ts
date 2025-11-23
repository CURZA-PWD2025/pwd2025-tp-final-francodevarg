import { instance as axios } from '@/plugins/axios'
import type { AuthPayload, LoginCredentials, RegisterCredentials } from '@/types/Auth'
import type { AxiosResponse } from 'axios'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthPayload> {
    return (await axios.post('auth/login', credentials)).data
  }

  async register(credentials: RegisterCredentials): Promise<AuthPayload> {
    const { data } = await axios.post<AuthPayload>('auth/register', credentials)
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

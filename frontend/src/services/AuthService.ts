import { instance as axios } from '@/plugins/axios'
import type { AxiosResponse } from 'axios'

class AuthService {
  async login(email: string, password: string): Promise<AxiosResponse> {
    return (await axios.post('/auth/login', { email, password })).data
  }

  async logout(): Promise<void> {
    await axios.post('/auth/logout')
  }

}

export default new AuthService()

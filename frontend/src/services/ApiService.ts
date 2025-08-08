import { instance as axios } from '@/plugins/axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiService {
  private withAuthHeader(useAuth: boolean): AxiosRequestConfig {
    return useAuth
      ? {}
      : {
          headers: {
            'Skip-Authorization': true,
          },
        }
  }

  async getAll<T>(url: string, useAuth = true): Promise<AxiosResponse<T[]>> {
    return axios.get<T[]>(url, this.withAuthHeader(useAuth))
  }

  async getOne<T>(url: string, id: number, useAuth = true): Promise<AxiosResponse<T>> {
    return axios.get<T>(`${url}${id}`, this.withAuthHeader(useAuth))
  }

  async create<T>(url: string, data: Partial<T>, useAuth = true): Promise<AxiosResponse<T>> {
    return axios.post<T>(url, data, this.withAuthHeader(useAuth))
  }

  async update<T>(url: string, id: number, data: Partial<T>, useAuth = true): Promise<AxiosResponse<T>> {
    return axios.put<T>(`${url}${id}`, data, this.withAuthHeader(useAuth))
  }

  async destroy(url: string, id: number, useAuth = true): Promise<AxiosResponse<{ message: string }>> {
    return axios.delete(`${url}${id}`, this.withAuthHeader(useAuth))
  }
}

export default new ApiService()

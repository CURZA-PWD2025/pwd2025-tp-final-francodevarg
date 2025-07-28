// services/ApiService.ts
import {instance as axios} from '../plugins/axios';
import type { AxiosResponse } from 'axios';

class ApiService {
  async getAll<T>(url: string): Promise<AxiosResponse<T[]>> {
    return await axios.get<T[]>(url);
  }

  async getOne<T>(url: string, id: number): Promise<AxiosResponse<T>> {
    return await axios.get<T>(`${url}${id}`);
  }

  async create<T>(url: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    return await axios.post<T>(url, data);
  }

  async update<T>(url: string, id: number, data: Partial<T>): Promise<AxiosResponse<T>> {
    return await axios.put<T>(`${url}${id}`, data);
  }

  async destroy(url: string, id: number): Promise<AxiosResponse<{ message: string }>> {
    return await axios.delete(`${url}${id}`);
  }
}

export default new ApiService();
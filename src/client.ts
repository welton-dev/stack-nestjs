import axios, { AxiosInstance } from 'axios';
import { ApiResponse, DataType } from './types';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
    });
  }

  // Exemplo de método para fazer requisição GET
  public async getData(): Promise<ApiResponse<DataType>> {
    try {
      const response = await this.client.get<ApiResponse<DataType>>('/endpoint');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'Erro na requisição');
    }
    return new Error('Erro inesperado');
  }
}

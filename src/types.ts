// Interfaces para os tipos de dados retornados pela API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Exemplo de interface de dados (você deve adaptar de acordo com sua API)
export interface DataType {
  id: number;
  // Adicione mais campos conforme necessário
}

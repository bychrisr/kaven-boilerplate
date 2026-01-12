// Tipos de erro da API
export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Axios error com tipagem adequada
export interface AxiosErrorResponse {
  response?: {
    data?: ApiError;
    status: number;
  };
  message: string;
}

// Helper para extrair mensagem de erro
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  return 'Erro desconhecido';
}

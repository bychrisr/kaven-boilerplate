import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Usar variável de ambiente ou fallback para localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// ✅ AXISOR STYLE: Request interceptor lê do localStorage DIRETAMENTE
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('🔍 AXIOS REQUEST - URL:', config.url);
    
    // ✅ AXISOR STYLE: Ler DIRETAMENTE do localStorage
    const token = localStorage.getItem('access_token');
    console.log('🔑 AXIOS REQUEST - Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ AXIOS REQUEST - Authorization header set');
    }
    
    // Multi-tenancy: Adicionar tenant ID se disponível
    const userStr = localStorage.getItem('kaven-auth');
    if (userStr) {
      try {
        const { state } = JSON.parse(userStr);
        if (state?.user?.tenantId) {
          config.headers['X-Tenant-ID'] = state.user.tenantId;
          console.log('✅ AXIOS REQUEST - Tenant ID header set');
        }
      } catch {
        console.log('⚠️ AXIOS REQUEST - Failed to parse user data');
      }
    }
    
    return config;
  },
  (error) => {
    console.log('❌ AXIOS REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// ✅ AXISOR STYLE: Response interceptor atualiza localStorage DIRETAMENTE
api.interceptors.response.use(
  (response) => {
    console.log('✅ AXIOS RESPONSE - Status:', response.status, 'URL:', response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.log('❌ AXIOS ERROR - Status:', error.response?.status, 'URL:', error.config?.url);
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se não é 401 ou já tentou retry, rejeitar
    if (error.response?.status !== 401 || originalRequest._retry) {
      throw error;
    }

    // Evitar retry em endpoints de auth
    if (originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')) {
      throw error;
    }

    originalRequest._retry = true;

    // ✅ AXISOR STYLE: Ler refresh token do localStorage
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      console.log('❌ AXIOS - No refresh token, redirecting to login');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      globalThis.location.href = '/login';
      throw error;
    }

    try {
      console.log('🔄 AXIOS - Attempting token refresh...');
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
        refreshToken: refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // ✅ AXISOR STYLE: Atualizar DIRETAMENTE no localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      
      console.log('✅ AXIOS - Token refreshed successfully');

      // Retry request original com novo token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      console.log('❌ AXIOS - Token refresh failed, redirecting to login');
      
      // Refresh falhou, limpar tudo e redirecionar
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      globalThis.location.href = '/login';
      
      throw refreshError;
    }
  }
);

export default api;

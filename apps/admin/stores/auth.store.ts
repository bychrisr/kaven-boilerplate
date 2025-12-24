import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  tenantId?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // ← Axisor style
  error: string | null;
  
  // Actions
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      
      // Login action (Axisor style)
      login: (user, accessToken, refreshToken) => {
        console.log('🔑 LOGIN - Storing tokens in localStorage...');
        
        // ✅ AXISOR STYLE: Armazenar DIRETAMENTE no localStorage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
        console.log('✅ LOGIN - Tokens stored in localStorage');
        
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
          error: null,
        });
        
        console.log('✅ LOGIN - State updated');
      },
      
      // Logout action (Axisor style)
      logout: () => {
        console.log('🚪 LOGOUT - Clearing tokens from localStorage...');
        
        // ✅ AXISOR STYLE: Remover do localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        console.log('✅ LOGOUT - Tokens cleared from localStorage');
        
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          error: null,
        });
        
        console.log('✅ LOGOUT - State cleared');
      },
      
      // Update user action
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      
      // Update tokens action (Axisor style)
      updateTokens: (accessToken, refreshToken) => {
        console.log('🔄 UPDATE TOKENS - Updating tokens in localStorage...');
        
        // ✅ AXISOR STYLE: Atualizar DIRETAMENTE no localStorage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
        console.log('✅ UPDATE TOKENS - Tokens updated in localStorage');
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Set loading
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'kaven-auth',
      // ✅ AXISOR STYLE: NÃO persistir isAuthenticated nem tokens
      partialize: (state) => ({
        user: state.user,
        // NÃO persistir tokens nem isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 REHYDRATE - Starting rehydration...');
        
        if (state) {
          // ✅ AXISOR STYLE: Verificar token no localStorage
          const token = localStorage.getItem('access_token');
          console.log('🔍 REHYDRATE - Token exists:', !!token);
          
          if (!token) {
            // Sem token = não autenticado
            console.log('❌ REHYDRATE - No token, setting isAuthenticated: false');
            state.set({ 
              isAuthenticated: false,
              isInitialized: true,
              error: null,
            });
          } else {
            // Token existe = autenticado
            console.log('✅ REHYDRATE - Token exists, setting isAuthenticated: true');
            state.set({ 
              isAuthenticated: true,
              isInitialized: true,
              error: null,
            });
            
            // ✅ AXISOR STYLE: Validar token em background
            // ✅ AXISOR STYLE: Validar token em background
            setTimeout(() => {
              console.group('🔄 AuthStore: Rehydration & Validation');
              console.log('1. Starting background token validation...');
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
              console.log('2. API URL:', apiUrl);
              console.log('3. Token starts with:', token.substring(0, 10) + '...');
              
              fetch(`${apiUrl}/api/users/me`, {
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              })
              .then(res => {
                console.log('4. API Response Status:', res.status);
                if (res.status === 401) throw new Error('Unauthorized');
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
              })
              .then(user => {
                console.log('5. ✅ Token valid. User found:', user.email);
                console.log('6. Updating state to authenticated.');
                state.set({ 
                  user,
                  isAuthenticated: true,
                });
                console.groupEnd();
              })
              .catch(error => {
                console.error('5. ❌ Validation error:', error.message);
                
                if (error.message === 'Unauthorized') {
                   console.log('6. 🔒 Token expired/invalid. Executing logout.');
                   localStorage.removeItem('access_token');
                   localStorage.removeItem('refresh_token');
                   state.set({ 
                     isAuthenticated: false,
                     user: null,
                   });
                } else {
                   console.warn('6. ⚠️ Network/Server error. KEEPING session active to avoid loop.');
                   // Não desloga em erro de rede, assume que o token ainda pode ser válido
                }
                console.groupEnd();
              });
            }, 100);
          }
        }
      },
    }
  )
);

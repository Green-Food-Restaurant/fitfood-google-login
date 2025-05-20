import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import authService from '@/services/authService';
import { jwtDecode } from 'jwt-decode';

// Tipos de dados
export interface User {
  name: string;
  email: string;
  picture?: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (credential: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  sessionTimeRemaining: number | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Criação do contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [sessionTimeoutInterval, setSessionTimeoutInterval] = useState<NodeJS.Timeout | null>(null);  // Função para calcular tempo restante da sessão
  const calculateSessionTimeRemaining = useCallback(() => {
    const token = authService.getToken();
    if (!token) {
      // Usar Promise.resolve no setTimeout para evitar atualização síncrona do estado
      setTimeout(() => setSessionTimeRemaining(null), 0);
      return null;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const expiresAt = decoded.exp * 1000; // Converter para milissegundos
      const timeRemaining = Math.max(0, expiresAt - Date.now());
      
      // Atualiza apenas se a diferença for maior que 5 segundos para evitar renderizações excessivas
      const timeDiff = Math.abs((sessionTimeRemaining || 0) - timeRemaining);
      
      if (sessionTimeRemaining === null || timeDiff > 5000) {
        // Usar setTimeout para quebrar o ciclo de renderização
        setTimeout(() => {
          setSessionTimeRemaining(timeRemaining);
        }, 0);
      }
      return timeRemaining;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      if (sessionTimeRemaining !== null) {
        setSessionTimeRemaining(null);
      }
      return null;
    }
  // remove dependency on sessionTimeRemaining to avoid circular updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para fazer logout - definida antes de ser usada
  const logout = useCallback(() => {
    // Limpar tokens e informações do usuário
    authService.logout();
    
    // Limpar estado do usuário
    setUser(null);
    setSessionTimeRemaining(null);
    
    // Limpar intervalos
    if (refreshInterval) clearInterval(refreshInterval);
    if (sessionTimeoutInterval) clearInterval(sessionTimeoutInterval);
    setRefreshInterval(null);
    setSessionTimeoutInterval(null);
  }, [refreshInterval, sessionTimeoutInterval]);
  // Função para renovar token - definida antes de ser usada
  const refreshToken = useCallback(async (): Promise<boolean> => {
    // Usamos uma variável estática para controlar se já está atualizando
    if ((refreshToken as any).isRefreshing) {
      console.log('Refresh token já está em andamento, ignorando chamada duplicada');
      // Retorna uma promise que será resolvida quando o refresh atual terminar
      return (refreshToken as any).currentPromise || Promise.resolve(false);
    }
    
    // Criar uma nova promise para esse processo de refresh
    const refreshPromise = (async () => {
      try {
        const success = await authService.refreshToken();
        
        if (success) {
          const userData = authService.getUserInfo();
          if (userData) {
            setUser(userData);
            // Calculamos o tempo restante após o refresh, mas sem causar loop
            setTimeout(() => calculateSessionTimeRemaining(), 100);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        return false;
      } finally {
        // Liberamos o flag quando terminar, seja com sucesso ou erro
        (refreshToken as any).isRefreshing = false;
        (refreshToken as any).currentPromise = null;
      }
    })();
    
    // Armazenamos o estado e a promise atual
    (refreshToken as any).isRefreshing = true;
    (refreshToken as any).currentPromise = refreshPromise;
    
    return refreshPromise;
  }, [calculateSessionTimeRemaining]);  // Configurar intervalos para acompanhar o tempo de sessão e renovar tokens
  const setupTokenRefresh = useCallback(() => {
    // Criamos uma variável auxiliar para controlar o cleanup
    let mounted = true;
    
    // Função segura para atualizar o estado apenas se o componente estiver montado
    const safeSetState = (setterFn: Function, value: any) => {
      if (mounted) {
        // Usar setTimeout para quebrar o ciclo de renderização
        setTimeout(() => {
          if (mounted) setterFn(value);
        }, 0);
      }
    };
    
    // Limpar intervalos existentes para evitar duplicação
    if (refreshInterval) {
      clearInterval(refreshInterval);
      safeSetState(setRefreshInterval, null);
    }
    
    if (sessionTimeoutInterval) {
      clearInterval(sessionTimeoutInterval);
      safeSetState(setSessionTimeoutInterval, null);
    }

    // Não configurar novos intervalos se não houver usuário
    if (!user) return;

    // Utilizamos uma flag independente para controlar as operações de refresh
    let isRefreshing = false;

    // Atualizar o tempo de sessão restante a cada 60 segundos (ainda mais espaçado)
    const timeoutInterval = setInterval(() => {
      // Não fazer nada se estiver ocupado
      if (isRefreshing) return;
      
      try {
        // Verificar diretamente do serviço sem usar o state para evitar ciclos de renderização
        const remaining = authService.getSessionTimeRemaining();
        
        // Se o token estiver próximo de expirar, realizar refresh
        if (remaining !== null && remaining < 120000 && remaining > 30000 && !isRefreshing) {
          isRefreshing = true;
          
          refreshToken()
            .catch(err => console.error('Erro ao renovar token:', err))
            .finally(() => {
              isRefreshing = false;
            });
        }
        
        // Se o token já expirou, tenta fazer refresh uma vez
        if (remaining !== null && remaining <= 0 && !isRefreshing) {
          console.warn('Sessão expirada, tentando renovar');
          isRefreshing = true;
          
          refreshToken()
            .then(success => {
              if (!success && mounted) {
                logout();
              }
            })
            .catch(err => console.error('Erro ao renovar token expirado:', err))
            .finally(() => {
              isRefreshing = false;
            });
        }
      } catch (error) {
        console.error('Erro ao verificar tempo de sessão:', error);
      }
    }, 60000); // A cada 60 segundos (aumentado de 30s para 60s)

    // Tentar renovar o token a cada 15 minutos para manter a sessão ativa
    const refreshTokenInterval = setInterval(() => {
      if (isRefreshing) return;
      
      try {
        const token = authService.getToken();
        // Só fazer refresh se estiver a menos de 15 minutos de expirar
        if (token && authService.isTokenExpired(token, 15 * 60 * 1000) && !isRefreshing) {
          isRefreshing = true;
          
          refreshToken()
            .catch(err => console.error('Erro no refresh periódico:', err))
            .finally(() => {
              isRefreshing = false;
            });
        }
      } catch (error) {
        console.error('Erro ao verificar expiração para refresh:', error);
      }
    }, 15 * 60 * 1000); // A cada 15 minutos (aumentado de 10min para 15min)
    
    // Atualizamos os estados com delay para evitar ciclos de renderização
    safeSetState(setSessionTimeoutInterval, timeoutInterval);
    safeSetState(setRefreshInterval, refreshTokenInterval);
    
    // Cleanup function
    return () => {
      mounted = false;
      clearInterval(timeoutInterval);
      clearInterval(refreshTokenInterval);
    };
  }, [user, calculateSessionTimeRemaining, refreshToken, logout]);

  // Limpar intervalos ao desmontar o componente
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
      if (sessionTimeoutInterval) clearInterval(sessionTimeoutInterval);
    };
  }, [refreshInterval, sessionTimeoutInterval]);
    // Função para verificar e carregar o estado de autenticação ao iniciar
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        // Verificar se há tokens ou informações parciais em storages diferentes
        const hasTokenInLocal = !!localStorage.getItem('fitfood_auth_token');
        const hasTokenInSession = !!sessionStorage.getItem('fitfood_auth_token');
        const hasUserInLocal = !!localStorage.getItem('fitfood_user_info');
        const hasUserInSession = !!sessionStorage.getItem('fitfood_user_info');
        
        // Detectar estado inconsistente e corrigir
        if ((hasTokenInLocal && !hasUserInLocal) || (hasTokenInSession && !hasUserInSession)) {
          console.warn('Estado inconsistente: token sem dados de usuário');
          authService.logout();
        }
        
        // Verificar se há um token válido
        if (authService.isAuthenticated()) {
          // Obter informações do usuário do armazenamento
          const userData = authService.getUserInfo();
          if (userData && userData.name && userData.email) {
            if (isMounted) {
              setUser(userData);          // Atrasar o cálculo do tempo de sessão para garantir que não gere loops
              setTimeout(() => {
                if (isMounted) {
                  try {
                    // Obtém dados de tempo diretamente do serviço sem atualizar o estado
                    const remaining = authService.getSessionTimeRemaining();
                    if (remaining !== null) {
                      setSessionTimeRemaining(remaining);
                    }
                  } catch (error) {
                    console.error('Erro ao calcular tempo de sessão:', error);
                  }
                }
              }, 200);
            }
            console.log('Autenticação recuperada com sucesso. Usuário:', userData.name);
          } else {
            // Se não conseguir extrair dados do usuário completos, limpar autenticação
            console.warn('Dados de usuário incompletos ou inválidos. Realizando logout.');
            authService.logout();
            if (isMounted) setUser(null);
          }
        } else {
          // Se o token existir mas estiver expirado, tentar renovar
          const token = authService.getToken();
          if (token && authService.isTokenExpired(token)) {
            console.log('Token expirado, tentando renovar sessão...');
            const refreshed = await refreshToken();
            if (refreshed) {
              console.log('Sessão renovada com sucesso');
            } else {
              console.warn('Falha ao renovar sessão, realizando logout');
              logout();
            }
          } else if (token) {
            console.warn('Token inválido encontrado, realizando logout');
            logout();
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        // Em caso de erro, garantir que o usuário seja redirecionado para login
        logout();
        if (isMounted) {
          setError('Erro ao inicializar autenticação. Por favor, faça login novamente.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();
    
    // Configurar listeners para eventos de autenticação
    const handleTokenExpired = () => {
      refreshToken();
    };
    
    const handleLogout = () => {
      logout();
    };
    
    document.addEventListener('auth:tokenExpired', handleTokenExpired);
    document.addEventListener('auth:logout', handleLogout);
    
    return () => {
      isMounted = false;
      document.removeEventListener('auth:tokenExpired', handleTokenExpired);
      document.removeEventListener('auth:logout', handleLogout);
    };
  // Dependências explícitas para evitar avisos do ESLint, mas não incluímos todas para evitar re-renderizações
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    // Função para fazer login com Google
  const login = async (credential: string, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    // Log para telemetria
    const loginAttemptId = `login-${Date.now()}`;
    console.log(`[Auth] Iniciando tentativa de login (ID: ${loginAttemptId})`);
    
    try {
      // Validar o formato do token
      if (!credential || typeof credential !== 'string' || credential.trim() === '') {
        throw new Error('Credencial inválida ou vazia');
      }
      
      // Usar o serviço de autenticação para fazer login
      console.log(`[Auth] Processando login com Google (ID: ${loginAttemptId})`);
      const userData = await authService.loginWithGoogle(credential, rememberMe);
      
      // Verificar se recebemos dados de usuário válidos
      if (!userData || !userData.name || !userData.email) {
        throw new Error('Falha ao obter dados válidos do usuário');
      }
      
      // Registrar explicitamente o papel do usuário para diagnóstico
      console.log(`[Auth] Login bem-sucedido para ${userData.email} (ID: ${loginAttemptId})`, {
        nome: userData.name,
        email: userData.email,
        papel: userData.role,
        isAdmin: userData.role === UserRole.ADMIN
      });
        // Definir o usuário no estado - o setupTokenRefresh será chamado automaticamente pelo useEffect
      setUser(userData);
      
      // Calcular tempo restante da sessão com um pequeno delay para evitar loops de renderização
      setTimeout(() => {
        calculateSessionTimeRemaining();
      }, 0);
      
      // Verificar se há uma rota para redirecionamento após o login
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');      if (redirectPath) {
        console.log(`[Auth] Redirecionando para ${redirectPath} após login`);
        sessionStorage.removeItem('redirectAfterLogin');
        // Usado em componentes que não têm acesso ao router
        document.dispatchEvent(new CustomEvent('auth:redirect', { 
          detail: { path: redirectPath } 
        }));
      }    } catch (error: unknown) {
      console.error(`[Auth] Erro no login (ID: ${loginAttemptId}):`, error);
      
      // Mensagem de erro amigável baseada no erro específico
      let errorMessage = 'Falha na autenticação. Por favor, tente novamente.';
      
      if (error instanceof Error) {
        // Verificar especificamente erros de CORS ou rede
        if (error.message.includes('Network Error') || 
            error.message.includes('CORS') || 
            error.message.includes('cross-origin')) {
          errorMessage = 'Erro de conexão com o servidor. Possível problema de CORS. Verifique sua internet ou entre em contato com o suporte.';
          console.warn('[Auth] Provável erro de CORS detectado');
        } else if (error.message.includes('network')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      } else if (error && typeof error === 'object' && 'response' in error && 
                (error.response as any)?.status === 401) {
        errorMessage = 'Credenciais inválidas ou expiradas.';
      } else if (error && typeof error === 'object' && 'response' in error && 
                (error.response as any)?.status === 403) {
        errorMessage = 'Você não tem permissão para acessar o sistema.';
      }
      
      setError(errorMessage);
      
      // Em caso de erro, limpar qualquer dado de autenticação parcial
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  // Verificar se o usuário é administrador
  const isAdmin = user?.role === UserRole.ADMIN;
  
  // Log para depuração sobre o status do usuário admin
  useEffect(() => {
    if (user) {
      console.log('Status de administrador no contexto:', {
        user: user.name,
        role: user.role,
        isAdmin: user.role === UserRole.ADMIN
      });
    }
  }, [user]);
  
  // Verificar se o usuário está autenticado
  const isAuthenticated = !!user;
  // Configurar refresh automático quando o usuário mudar
  useEffect(() => {
    if (user) {
      // Usamos setTimeout para evitar chamadas durante o ciclo de renderização
      const timeoutId = setTimeout(() => {
        setupTokenRefresh();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Valor do contexto a ser fornecido
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    logout,
    refreshToken,
    sessionTimeRemaining
  };

  return (
    <AuthContext.Provider value={contextValue}>    {children}
  </AuthContext.Provider>
  );
};

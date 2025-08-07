import httpService from './httpService';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '@/contexts/AuthContext';

// Constantes
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;
const USER_INFO_KEY = import.meta.env.VITE_USER_INFO_KEY;
const REMEMBER_ME_KEY = import.meta.env.VITE_REMEMBER_ME_KEY;
const SESSION_TIMEOUT = Number(import.meta.env.VITE_SESSION_TIMEOUT);

// Interfaces
interface TokenPayload {
  id: number;
  role?: {
    id: number;
    name: string;
    __entity?: string;
  };
  sessionId?: number;
  exp: number;
  iat?: number;
}

interface ApiRole {
  id: number;
  name: string;
  __entity?: string;
}

interface ApiStatus {
  id: number;
  name: string;
  __entity?: string;
}

interface ApiUser {
  id: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  role: ApiRole;
  status: ApiStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface User {
  name: string;
  email: string;
  picture?: string;
  role: UserRole;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: ApiUser;
}

// Serviço de autenticação
class AuthService {  /**
   * Autentica um usuário com o Google OAuth
   * @param idToken Token JWT do Google
   * @param rememberMe Se verdadeiro, mantém o usuário logado por mais tempo
   * @returns Dados de autenticação do usuário
   */  async loginWithGoogle(idToken: string, rememberMe = false): Promise<User> {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log('Iniciando processo de login com Google');
      
      // Adicionar um pequeno delay para garantir que o token seja processado corretamente
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Corrigimos a URL para evitar duplicação do prefixo /api/v1
      const response = await httpService.post<AuthResponse>(`/google/login`, {
        idToken,
        rememberMe
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true'
      });
      
      // Converter o formato da API para o formato interno da aplicação
      const userData = this.convertApiUserToAppUser(response.user);
      
      // Salvar dados de autenticação
      this.saveAuthData(response.token, response.refreshToken, userData, rememberMe);
      return userData;
    } catch (error) {
      // Verificar se é um erro de rede
      if (error instanceof Error && error.message.includes('Network Error')) {
        console.error('[Auth] Erro de rede detectado durante autenticação com Google');
        throw new Error('Erro de conexão com o servidor de autenticação.');
      }
      
      console.error('Erro durante autenticação com Google:', error);
      throw error;
    }
  }  /**
   * Converte o usuário da API para o formato interno da aplicação
   * @param apiUser Usuário retornado da API
   * @returns Usuário no formato da aplicação
   */  convertApiUserToAppUser(apiUser: ApiUser): User {
    // Verificação mais robusta do papel de administrador
    // Consideramos como administrador se o nome do papel contém 'admin' (case insensitive)
    // ou se o ID do papel for 1 (normalmente reservado para administradores)
    
    // Verificação de segurança para propriedades indefinidas
    const roleName = apiUser?.role?.name || '';
    const roleId = apiUser?.role?.id || 0;
    
    // Um usuário é admin se o nome do papel contém 'admin' OU o ID do papel é 1
    const isAdmin = roleName.toLowerCase().includes('admin') || roleId === 1;

    return {
      name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
      email: apiUser.email,
      // Geramos um avatar se não houver foto (podemos melhorar isso depois adicionando o campo photo)
      picture: `https://ui-avatars.com/api/?name=${apiUser.firstName}+${apiUser.lastName}`,
      role: isAdmin ? UserRole.ADMIN : UserRole.USER
    };
  }

  /**
   * Extrai informações do usuário de um token JWT
   * @param token Token JWT para decodificar
   * @returns Dados do usuário
   */  extractUserFromToken(token: string): User | null {
    try {
      // Para tokens da API, verificamos o formato específico
      const decoded = jwtDecode<TokenPayload>(token);
      
      // Verificação mais robusta do papel do usuário
      const roleName = decoded.role?.name || '';
      const roleId = decoded.role?.id || 0;
      
      // Um usuário é admin se o nome do papel contém 'admin' OU o ID do papel é 1
      const isAdmin = roleName.toLowerCase().includes('admin') || roleId === 1;
      
      // Extrair informações básicas do token
      return {
        name: decoded.id ? `Usuário ${decoded.id}` : 'Usuário',
        email: `usuario${decoded.id || ''}@exemplo.com`,
        picture: `https://ui-avatars.com/api/?name=Usuario+${decoded.id || 'Demo'}`,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      // Em caso de erro, retornar um usuário padrão (apenas para demonstração)
      return {
        name: 'Usuário Demo',
        email: 'demo@greenfood.com',
        picture: 'https://ui-avatars.com/api/?name=Usuario+Demo',
        role: UserRole.USER
      };
    }
  }  /**
   * Renova o token de acesso usando o refresh token
   * @returns Booleano indicando sucesso ou falha
   */
  async refreshToken(): Promise<boolean> {
    // Número máximo de tentativas de renovação
    const maxRetries = 3;
    let retryCount = 0;
    let success = false;
    
    while (retryCount < maxRetries && !success) {
      try {
        // Obter o refresh token existente
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
        
        if (!refreshToken) {
          console.warn('Refresh token não encontrado');
          return false;
        }
        
        // Tempo de espera exponencial entre as tentativas (0ms, 200ms, 600ms)
        if (retryCount > 0) {
          const delay = Math.pow(2, retryCount - 1) * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        const response = await httpService.post<AuthResponse>(`${AUTH_API_URL}/refresh-token`, {
          refreshToken
        });
        
        if (!response.token || !response.refreshToken) {
          throw new Error('Resposta inválida ao renovar token');
        }
        
        // Converter o formato da API para o formato interno da aplicação
        const userData = this.convertApiUserToAppUser(response.user);
        
        // Se não houver erros até aqui, consideramos a operação bem-sucedida
        this.saveAuthData(response.token, response.refreshToken, userData);
        success = true;
        
        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log('Token renovado com sucesso');
        }
        
        return true;
      } catch (error) {
        retryCount++;
        console.error(`Erro ao renovar token (tentativa ${retryCount}/${maxRetries}):`, error);
        
        // Se for a última tentativa, retornamos falha
        if (retryCount >= maxRetries) {
          return false;
        }
      }
    }
    
    return success;
  }/**
   * Salva dados de autenticação no armazenamento local ou da sessão
   * @param idToken Token JWT
   * @param refreshToken Token de renovação
   * @param userData Dados do usuário
   * @param rememberMe Opção de lembrar usuário
   */  saveAuthData(idToken: string, refreshToken: string, userData: User, rememberMe = false): void {
    // Primeiro limpamos os dados anteriores para evitar dados inconsistentes
    this.clearStorageData();
    
    // Validar dados do usuário
    if (!userData || !userData.name || !userData.email) {
      console.error('Dados de usuário inválidos ao salvar autenticação', userData);
      userData = {
        name: 'Usuário',
        email: 'usuario@exemplo.com',
        role: UserRole.USER
      };
    }
    
    // Validação específica para garantir que o papel está definido corretamente
    if (userData.role !== UserRole.ADMIN && userData.role !== UserRole.USER) {
      console.warn('Papel de usuário inválido, definindo como USER por padrão');
      userData.role = UserRole.USER;
    }
    
    // Log dos dados que serão salvos
    console.log('Salvando dados de autenticação:', {
      user: userData.name,
      email: userData.email,
      role: userData.role,
      rememberMe: rememberMe
    });
    
    // Salvamos a preferência de "lembrar-me"
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));

    // Definimos o storage adequado com base na opção "lembrar-me"
    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Salvar dados de autenticação
    if (idToken) {
      storage.setItem(TOKEN_KEY, idToken);
    }
    
    if (refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    
    storage.setItem(USER_INFO_KEY, JSON.stringify(userData));
    
    // Disparar evento para informar que os dados de autenticação foram atualizados
    document.dispatchEvent(new CustomEvent('auth:updated'));
  }
  
  /**
   * Limpa os dados de autenticação do localStorage e sessionStorage
   */
  private clearStorageData(): void {
    // Limpar dados do localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    
    // Limpar dados do sessionStorage também
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_INFO_KEY);
  }
  /**
   * Realiza logout do usuário
   */
  logout(): void {
    // Usar o método privado para limpar todos os dados de armazenamento
    this.clearStorageData();
    
    // Também remover a preferência de lembrar-me
    localStorage.removeItem(REMEMBER_ME_KEY);
    
    // Remover também para compatibilidade com código antigo
    localStorage.removeItem('userRole');
    
    // Remover o disparo do evento 'auth:logout' para evitar loop
    // document.dispatchEvent(new CustomEvent('auth:logout'));
    
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Logout realizado com sucesso');
    }
  }  /**
   * Verifica se o usuário está autenticado com um token válido
   * @returns Booleano indicando se há um usuário autenticado com token válido
   */
  isAuthenticated(): boolean {
    try {
      // Verificar primeiro no sessionStorage (sessão atual)
      let token = sessionStorage.getItem(TOKEN_KEY);
      
      // Se não encontrar no sessionStorage, verificar no localStorage (lembrar-me)
      if (!token) {
        token = localStorage.getItem(TOKEN_KEY);
      }
      
      // Verificar também se temos dados de usuário
      const userDataSession = sessionStorage.getItem(USER_INFO_KEY);
      const userDataLocal = localStorage.getItem(USER_INFO_KEY);
      const hasUserData = !!(userDataSession || userDataLocal);
      
      // Para ser considerado autenticado, precisamos de token válido E dados de usuário
      if (!token || !hasUserData) {
        return false;
      }
      
      // Verificar se o token não está expirado
      if (this.isTokenExpired(token)) {
        console.log('Token expirado durante verificação de autenticação');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }
  /**
   * Verifica se o usuário atual é um administrador
   * @returns Booleano indicando se o usuário é administrador
   */  isAdmin(): boolean {
    // Tentar obter usuário do sessionStorage primeiro
    let userJson = sessionStorage.getItem(USER_INFO_KEY);
    
    // Se não encontrar, tentar do localStorage
    if (!userJson) {
      userJson = localStorage.getItem(USER_INFO_KEY);
    }
    
    if (!userJson) return false;
    
    try {
      const user = JSON.parse(userJson);
      
      // Log para debug
      console.log('Verificando função isAdmin():', {
        user: user,
        role: user?.role,
        isAdmin: user?.role === UserRole.ADMIN
      });
      
      // Verifica se o papel do usuário é ADMIN usando a enum UserRole
      return user && user.role === UserRole.ADMIN;
    } catch (error) {
      console.error('Erro ao verificar papel de administrador:', error);
      return false;
    }
  }
  /**
   * Verifica se um token JWT está expirado
   * @param token Token JWT para verificar
   * @param gracePeriodMs Período de graça em ms (padrão: 60 segundos)
   * @returns Booleano indicando se o token está expirado
   */
  isTokenExpired(token: string, gracePeriodMs = 60000): boolean {
    try {
      // Verificar se o token é válido
      if (!token || token.trim() === '') {
        return true;
      }
      
      const decoded = jwtDecode<TokenPayload>(token);
      
      // Verificar se o payload tem um tempo de expiração válido
      if (!decoded || !decoded.exp || typeof decoded.exp !== 'number') {
        console.warn('Token sem data de expiração válida');
        return true;
      }
      
      // Verifica se o token expira nos próximos X ms (padrão: 60 segundos)
      const expirationTime = decoded.exp * 1000; // Converter para milissegundos
      const currentTime = Date.now();
      
      // Para tokens muito antigos ou futuros (mais de 1 dia de diferença), considerar inválidos
      if (Math.abs(expirationTime - currentTime) > 86400000) { // 24 horas em ms
        console.warn('Token com timestamp muito distante do atual');
        return true;
      }
      
      // Retorna true se o token já expirou ou vai expirar dentro do período de graça
      return expirationTime < (currentTime + gracePeriodMs);
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return true;
    }
  }
  /**
   * Obtém o token de autenticação atual
   * @returns Token JWT ou null
   */
  getToken(): string | null {
    // Verificar primeiro no sessionStorage
    let token = sessionStorage.getItem(TOKEN_KEY);
    
    // Se não encontrar no sessionStorage, verificar no localStorage
    if (!token) {
      token = localStorage.getItem(TOKEN_KEY);
    }
    
    return token;
  }

  /**
   * Obtém informações do usuário atual
   * @returns Dados do usuário
   */
  getUserInfo(): User | null {
    // Verificar primeiro no sessionStorage
    let userJson = sessionStorage.getItem(USER_INFO_KEY);
    
    // Se não encontrar no sessionStorage, verificar no localStorage
    if (!userJson) {
      userJson = localStorage.getItem(USER_INFO_KEY);
    }
    
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica se o modo "lembrar-me" está ativo
   * @returns Booleano indicando se o usuário escolheu "lembrar-me"
   */
  isRememberMeActive(): boolean {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  }

  /**
   * Calcula o tempo restante da sessão em milissegundos
   * @returns Tempo restante ou null se não houver sessão ativa
   */
  getSessionTimeRemaining(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const expiresAt = decoded.exp * 1000; // Converter para milissegundos
      return Math.max(0, expiresAt - Date.now());
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();

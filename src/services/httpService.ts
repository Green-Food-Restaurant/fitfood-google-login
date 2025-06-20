import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import authService from './authService';

// Constantes
const API_URL = 'http://173.249.12.112:8081/green-food/api/v1';

// Serviço que gerencia requisições HTTP autenticadas
class HttpService {
  private api: AxiosInstance;
  private static instance: HttpService;
  private constructor() {    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Referrer-Policy': 'no-referrer-when-downgrade',
        'X-Frame-Options': 'DENY',
        'X-Permitted-Cross-Domain-Policies': 'none',
        'Feature-Policy': "camera 'none'; microphone 'none'; geolocation 'none'",
        'Permissions-Policy': "camera=(), microphone=(), geolocation=()"
      },
      withCredentials: true // Para suportar autenticação baseada em cookies nas solicitações cross-origin
    });

    this.setupInterceptors();
  }

  // Padrão Singleton para garantir apenas uma instância do serviço
  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }
  // Configura interceptadores para injetar automaticamente tokens de autenticação
  // e lidar com erros de forma centralizada
  private setupInterceptors(): void {    // Interceptador de requisição - adiciona token às requisições
    this.api.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = authService.getToken();
        
        // Obter headers ou criar se não existirem
        if (!config.headers) {
          config.headers = {};
        }
        
        // Adicionar cabeçalhos de segurança básicos a todas as requisições
        config.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
        
        // Adicionar token de autenticação se disponível
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          
          // Adicionar timestamp para prevenir ataques de replay
          config.headers['X-Request-Timestamp'] = Date.now().toString();
          
          // Adicionar proteção CSRF para requisições não-GET que modificam dados
          if (config.method !== 'get') {
            const csrfToken = this.generateCSRFToken();
            config.headers['X-CSRF-Token'] = csrfToken;
          }
          
          // Adicionar identificador de requisição único
          config.headers['X-Request-ID'] = `req-${crypto.randomUUID?.() || 
            Math.random().toString(36).substring(2, 15)}`;
          
          // Assinar a requisição com token parcial para verificação
          const tokenFragment = token.substring(token.length - 10);
          config.headers['X-Auth-Check'] = tokenFragment;
        }
        
        return config;
      },
      (error: any) => {
        console.error('Erro na preparação da requisição:', error);
        return Promise.reject(error);
      }
    );// Interceptador de resposta - trata erros de autenticação e verificação CSRF
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Verificar se a resposta possui um token CSRF para validar
        const csrfToken = response.headers['x-csrf-token'];
        if (csrfToken && !this.verifyCSRFToken(csrfToken)) {
          console.error('Falha na validação CSRF. Possível ataque CSRF detectado.');
          
          // Limpar tokens inválidos
          sessionStorage.removeItem('csrf_token');
          
          // Disparar evento para forçar logout
          document.dispatchEvent(new CustomEvent('auth:logout'));
          
          return Promise.reject(new Error('Falha na validação de segurança CSRF'));
        }
        
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Verificar se é erro 401 (Não Autorizado) e não é uma tentativa de refresh
        if (error.response?.status === 401 && 
            originalRequest && 
            !(originalRequest as any)._retry) {
          
          try {
            // Marcar que esta requisição já passou por retry para evitar loops infinitos
            (originalRequest as any)._retry = true;
            
            // Disparar evento para notificar que o token expirou
            const refreshEvent = new CustomEvent('auth:tokenExpired');
            document.dispatchEvent(refreshEvent);
            
            // Aguardar tempo para o token ser renovado pelo contexto
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Tentar obter o novo token após o refresh
            const newToken = authService.getToken();
            
            if (newToken && originalRequest.headers) {
              // Atualizar o token na requisição original
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              
              // Gerar novo token CSRF para a nova requisição
              if (originalRequest.method !== 'get') {
                const csrfToken = this.generateCSRFToken();
                originalRequest.headers['X-CSRF-Token'] = csrfToken;
              }
              
              // Tentar novamente a requisição original com o novo token
              return this.api(originalRequest);
            } else {
              throw new Error('Falha ao obter novo token após refresh');
            }
          } catch (refreshError) {
            console.error('Erro no processo de refresh de token:', refreshError);
            
            // Disparar evento para realizar logout em caso de falha no refresh
            document.dispatchEvent(new CustomEvent('auth:logout'));
            
            // Redirecionar para a página de login
            window.location.href = '/';
            
            return Promise.reject(refreshError);
          }
        }
        
        // Para outros códigos de erro específicos, podemos ter tratamentos próprios
        if (error.response?.status === 403) {
          console.error('Acesso proibido (403):', error.response.data);
          // Opcionalmente disparar evento de acesso proibido
        }
        
        if (error.response?.status === 500) {
          console.error('Erro no servidor (500):', error.response.data);
          // Opcionalmente registrar o erro em serviço de telemetria
        }
        
        return Promise.reject(error);
      }
    );
  }  // Gera um token CSRF mais seguro
  private generateCSRFToken(): string {
    // Gerar um array de bytes aleatórios
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    
    // Converter para string base64
    const base64Token = btoa(String.fromCharCode.apply(null, Array.from(randomBytes)));
    
    // Armazenar o token para verificação posterior (em uma aplicação real, isso seria verificado pelo servidor)
    sessionStorage.setItem('csrf_token', base64Token);
    
    return base64Token;
  }
  
  // Verifica se o token CSRF é válido (usado em respostas do servidor)
  private verifyCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }

  // Métodos para fazer requisições HTTP
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export default HttpService.getInstance();

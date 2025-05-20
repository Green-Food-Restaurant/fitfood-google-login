import httpService from '@/services/httpService';

// Esta função atua como um adaptador para compatibilizar
// as diferentes estruturas de resposta que a API pode retornar
export function adaptApiResponse(apiResponse: any) {
  try {
    console.log('Adaptando resposta da API:', apiResponse);
    
    // Se já recebemos a estrutura correta
    if (typeof apiResponse === 'object' && 'data' in apiResponse && 'hasNextPage' in apiResponse) {
      return {
        data: apiResponse.data || [],
        hasNextPage: !!apiResponse.hasNextPage,
        totalItems: apiResponse.totalItems || apiResponse.data.length
      };
    }
    
    // Se for uma resposta flat (array)
    if (Array.isArray(apiResponse)) {
      return {
        data: apiResponse,
        hasNextPage: false,
        totalItems: apiResponse.length
      };
    }
    
    // Se o dados estiverem em outro formato
    if (apiResponse && typeof apiResponse === 'object' && Array.isArray(apiResponse.data)) {
      return {
        data: apiResponse.data,
        hasNextPage: !!apiResponse.hasNextPage, 
        totalItems: apiResponse.totalItems || apiResponse.data.length
      };
    }
    
    // Resposta padrão para casos não reconhecidos
    console.error('Formato de resposta não reconhecido:', apiResponse);
    return {
      data: [],
      hasNextPage: false,
      totalItems: 0
    };
  } catch (error) {
    console.error('Erro ao adaptar resposta da API:', error);
    // Retornar uma estrutura vazia em caso de erro
    return {
      data: [],
      hasNextPage: false,
      totalItems: 0
    };
  }
}

// Essa função permite realizar chamadas à API com verificações adicionais
// e adapta a resposta automaticamente para o formato esperado pela aplicação
export async function safeApiCall<T>(
  endpoint: string, 
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'get',
  data?: any,
  params?: Record<string, string>
): Promise<T> {
  try {
    let url = endpoint;
    
    // Adicionar parâmetros de query string se fornecidos
    if (params) {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        queryParams.append(key, value);
      }
      url = `${url}?${queryParams.toString()}`;
    }
    
    console.log(`Realizando chamada ${method.toUpperCase()} para ${url}`);
    
    let response;
    switch (method) {
      case 'get':
        response = await httpService.get(url);
        break;
      case 'post':
        response = await httpService.post(url, data);
        break;
      case 'put':
        response = await httpService.put(url, data);
        break;
      case 'patch':
        response = await httpService.patch(url, data);
        break;
      case 'delete':
        response = await httpService.delete(url);
        break;
    }
    
    return response as T;
  } catch (error) {
    console.error(`Erro na chamada à API ${method.toUpperCase()} ${endpoint}:`, error);
    throw error;
  }
}

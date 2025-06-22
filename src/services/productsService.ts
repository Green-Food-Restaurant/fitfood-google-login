import axios from 'axios';

// URL base da API
const BASE_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8082/v1/product';

// Tipos
export interface ProductResponse {
  id: number;
  nomeProduto: string;
  preco: number;
  category: string;
  descricao: string;
  urlImage: string | null;
  estoque: number;
  ativo: boolean;
}

export interface ProductRequest {
  nameProduct: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string | null;
  estoque: number;
  ativo?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Obter todos os produtos (paginado)
export const getProdutos = async (page = 0, size = 10, sortBy = 'id'): Promise<PaginatedResponse<ProductResponse>> => {
  try {
    const response = await axios.get(`${BASE_URL}/find`, {
      params: {
        page,
        size,
        sortBy,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// Buscar produtos por IDs
export const getProdutosByIds = async (ids: number[]): Promise<ProductResponse[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/find/ids`, {
      params: {
        ids: ids.join(',')
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos por IDs:', error);
    throw error;
  }
};

// Cadastrar novo produto
export const createProduto = async (produto: ProductRequest): Promise<ProductResponse> => {
  try {
    const response = await axios.post(BASE_URL, produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    throw error;
  }
};

// Atualizar produto existente
export const updateProduto = async (id: number, produto: ProductRequest): Promise<ProductResponse> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

// Excluir produto
export const deleteProduto = async (id: number): Promise<string> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    throw error;
  }
};

// Ativar produto
export const activateProduto = async (id: number): Promise<string> => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    console.error('Erro ao ativar produto:', error);
    throw error;
  }
};

// Desativar produto
export const deactivateProduto = async (id: number): Promise<string> => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Erro ao desativar produto:', error);
    throw error;
  }
};

// Filtro avançado de produtos
export const filterProdutos = async (
  filters: {
    category?: string;
    precoMinimo?: number;
    precoMaximo?: number;
    ativo?: boolean;
  },
  page = 0,
  size = 10,
  sortBy = 'id',
  direction = 'asc'
): Promise<PaginatedResponse<ProductResponse>> => {
  try {
    const response = await axios.get(`${BASE_URL}/filter`, {
      params: {
        ...filters,
        page,
        size,
        sortBy,
        direction
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao filtrar produtos:', error);
    throw error;
  }
};

// Filtrar por categoria (paginado)
export const getProdutosByCategoria = async (
  category: string,
  page = 0,
  size = 10,
  sortBy = 'nomeProduto'
): Promise<PaginatedResponse<ProductResponse>> => {
  try {
    const response = await axios.get(`${BASE_URL}/filter/category`, {
      params: {
        category,
        page,
        size,
        sortBy
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    throw error;
  }
};

// Buscar todos os produtos de uma categoria (sem paginação)
export const getAllProdutosByCategoria = async (category: string): Promise<ProductResponse[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/filter/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os produtos por categoria:', error);
    throw error;
  }
};

// Filtrar por faixa de preço
export const getProdutosByPriceRange = async (
  precoMinimo: number,
  precoMaximo: number,
  page = 0,
  size = 10,
  sortBy = 'preco'
): Promise<PaginatedResponse<ProductResponse>> => {
  try {
    const response = await axios.get(`${BASE_URL}/filter/price`, {
      params: {
        precoMinimo,
        precoMaximo,
        page,
        size,
        sortBy
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos por faixa de preço:', error);
    throw error;
  }
};

// Filtrar por status (ativo/inativo)
export const getProdutosByStatus = async (
  ativo: boolean,
  page = 0,
  size = 10,
  sortBy = 'id'
): Promise<PaginatedResponse<ProductResponse>> => {
  try {
    const response = await axios.get(`${BASE_URL}/filter/status`, {
      params: {
        ativo,
        page,
        size,
        sortBy
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos por status:', error);
    throw error;
  }
};

// Upload de imagem para um produto
export const uploadProdutoImage = async (id: number, file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    await axios.post(`${BASE_URL}/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    throw error;
  }
};

// Obter URL da imagem de um produto
export const getProdutoImageUrl = async (id: number): Promise<string> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/image`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter URL da imagem:', error);
    throw error;
  }
};


